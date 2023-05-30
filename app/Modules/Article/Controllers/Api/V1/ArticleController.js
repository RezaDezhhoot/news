const Article = require("../../../Models/Article");
const ArticleResource = require("../../../Resources/Api/V1/ArticleResource");
const Redis = require('../../../../../Libraries/Redis');

module.exports.index = async (req , res) => {
    const page = +req.query.page || 1 , PerPage = +req.query.per_page || 4

    let articles , itemNumbers , options = {$and:[{status: true}]};

    await Redis.connect();

    const redis_key = `articles${page}${PerPage}${req.query.search ?? null}`;

    let value =  await Redis.get(redis_key);
    value = JSON.parse(value);
    if (value) {
        articles = value.items;
        itemNumbers = value.count;
    } else {
        if (req.query.search)
            options.$and.push({title: {$regex: '.*' + req.query.search + '.*'}});

        articles = await Article.find(options)
            .select(['_id','title','image','created_at'])
            .sort([['created_at', 'descending']])
            .skip((page-1)*PerPage)
            .limit(PerPage);
        itemNumbers = await Article.find(options).countDocuments();

        await Redis.set(redis_key,JSON.stringify({
            items: articles,
            count: itemNumbers
        }));
        await Redis.expire(redis_key, eval(process.env.REDIS_LIFETIME) * 60 * 60);
    }

    await Redis.disconnect();

    let hasNextPage = PerPage * page < itemNumbers , hasPrePage = page>1 ;

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
        message: res.__('general.success')
    });
}

module.exports.show = async (req , res) => {
    let data = {} , message = req.__('general.success') , status = 200;
    try {
        const article = await Article.findOne({$and: [
            {_id: req.params.id},
                {status: true}
            ]
        });
        if (! article) {
            message = req.__('general.not_found');
            status = 404;
        } else data = ArticleResource.make(article);
    } catch (e) {
        message = req.__('general.error');
        status = 500;
    }
    return res.status(status).json({data, message});
}