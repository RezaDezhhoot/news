const Article = require("../../../Models/Article");
const ArticleResource = require("../../../Resources/Api/V1/ArticleResource");
const utils = require("../../../../../../utils/helpers");

module.exports.index = async (req , res) => {
    const page = +req.query.page || 1;
    const PerPage = +req.query.per_page || 10;
    let articles , itemNumbers , options = {$and:[{status: true}]};

    if (req.query.search)
        options.$and.push({title: {$regex: '.*' + req.query.search + '.*'}});

    articles = await Article.find(options).select(['_id','title','image','created_at'])
        .sort([['created_at', 'descending']])
        .skip((page-1)*PerPage)
        .limit(PerPage);
    itemNumbers = await Article.find(options).countDocuments();

    let hasNextPage = PerPage * page < itemNumbers;
    let hasPrePage = page>1;

    return res.status(200).json({
        data: {
            articles: ArticleResource.collection(articles),
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

module.exports.show = async (req , res) => {
    let data = {} , message = 'success' , status = 200;
    try {
        const article = await Article.findOne({$and: [
            {_id: req.params.id},
                {status: true}
            ]
        });
        if (! article) {
            message = 'article not found';
            status = 404;
        } else data = ArticleResource.make(article);
    } catch (e) {
        message = 'error';
        status = 500;
    }
    return res.status(status).json({data, message});
}