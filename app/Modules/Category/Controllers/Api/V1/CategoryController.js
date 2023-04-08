const Category = require('../../../Models/Category');
const CategoryResource = require('../../../Resources/Api/V1/CategoryResourse');

module.exports.index = async (req,res) =>
{
    const page = +req.query.page || 1;
    const PerPage = +req.query.per_page || 10;
    let categories , itemNumbers;

    categories = await Category.find({status:true}).sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
    itemNumbers = await Category.find({status:true}).countDocuments();

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