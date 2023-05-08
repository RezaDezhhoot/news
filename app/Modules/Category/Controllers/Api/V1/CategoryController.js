const Category = require('../../../Models/Category');
const CategoryResource = require('../../../Resources/Api/V1/CategoryResourse');
const Redis = require("../../../../../Libraries/Redis");

module.exports.index = async (req,res) =>
{
    const page = +req.query.page || 1;
    const PerPage = +req.query.per_page || 10;
    let categories , itemNumbers;

    await Redis.connect();

    const redis_key = `categories${page}${PerPage}${req.query.search ?? null}`;
    let value =  await Redis.get(redis_key);
    value = JSON.parse(value);
    if (value) {
        categories = value.items;
        itemNumbers = value.count;
    } else {
        categories = await Category.find({status:true}).sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
        itemNumbers = await Category.find({status:true}).countDocuments();

        await Redis.set(redis_key,JSON.stringify({
            items: categories,
            count: itemNumbers
        }),"EX",eval(process.env.REDIS_LIFETIME) * 60 * 60);
    }

    await Redis.disconnect();

    let hasNextPage = PerPage * page < itemNumbers;
    let hasPrePage = page>1;

    return res.status(200).json({
        data: {
            categories: await CategoryResource.collection(categories),
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

}