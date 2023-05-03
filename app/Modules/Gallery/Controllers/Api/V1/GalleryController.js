const Gallery = require('../../../Models/Gallery');
const GalleryResource = require('../../../Resources/Api/V1/GalleryResource');
const mongoose = require('mongoose');
const Redis = require("../../../../../Libraries/Redis");

module.exports.index = async (req , res) => {
    const page = +req.query.page || 1;
    const PerPage = +req.query.per_page || 10;
    let galleries , itemNumbers;

    try {
        await Redis.connect();
        const redis_key = `galleries${page}${PerPage}${req.query.search}`;
        let value;

        if (value = await Redis.get(redis_key)) {
            value = JSON.parse(value);
            galleries = value.items;
            itemNumbers = value.count;
        } else {
            const condition = {$and:[
                    {status: true},
                    {category: new mongoose.Types.ObjectId(req.query.category) }]
            };

            galleries = await Gallery.find(condition).sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
            itemNumbers = await Gallery.find(condition).countDocuments();

            await Redis.set(redis_key,JSON.stringify({
                items: galleries,
                count: itemNumbers
            }),"EX",eval(process.env.REDIS_LIFETIME) * 60 * 60);
        }

        await Redis.disconnect();

        let hasNextPage = PerPage * page < itemNumbers;
        let hasPrePage = page>1;

        return res.status(200).json({
            data: {
                galleries: GalleryResource.collection(galleries),
                meta:{
                    currentPage: page,
                    nextPage: hasNextPage ? page + 1 : undefined,
                    prePage: hasPrePage ? page-1 : undefined,
                    lastPage: Math.ceil(itemNumbers/PerPage),
                    hasNextPage,
                    hasPrePage,
                }
            },
            message: 'success'
        });
    } catch (e) {
        return res.status(500).json({
            message: 'error'
        });
    }
}