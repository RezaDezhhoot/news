const utils = require('../../../../../../utils/helpers');
const {ARTICLE_IMAGE_FOLDER} = require('../../../../../Base/Constants/File');

module.exports.make = (article) => {
    return {
        '_id': article._id,
        'title': article.title,
        'body': article.description,
        'created_at': article.created_at,
        'image': utils.asset(ARTICLE_IMAGE_FOLDER + '/' + article.image),
    }
}

module.exports.collection = (articles) => {
    let res = [];
    articles.forEach( (v , k) => {
        res[k] =  {
            '_id': v._id,
            'title': v.title,
            'created_at': v.created_at,
            'image': utils.asset(ARTICLE_IMAGE_FOLDER + '/' + v.image),
        }
    } );

    return res;
}