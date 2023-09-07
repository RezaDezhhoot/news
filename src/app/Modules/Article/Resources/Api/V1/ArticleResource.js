const utils = require('../../../../../../utils/helpers');
const {ARTICLE_IMAGE_FOLDER, ARTICLE_VIDEO_FOLDER} = require('../../../../../Base/Constants/File');
const {VIDEO} = require("../../../Enums/Priority");
const {IMAGE} = require("../../../../Gallery/Enums/Priority");

module.exports.make = (article) => {
    let priority = article.priority ?? IMAGE;
    return {
        '_id': article._id,
        'title': article.title,
        'body': article.description,
        'media': priority === VIDEO ? ( article?.video ? utils.asset(ARTICLE_VIDEO_FOLDER + '/' + article?.video) : null) : article.image ? utils.asset(ARTICLE_IMAGE_FOLDER + '/' + article.image) : null,
        'media_type': article.priority,
        'created_at': utils.convertTZ(article.created_at),
        'image': utils.asset(ARTICLE_IMAGE_FOLDER + '/' + article.image),
    }
}

module.exports.collection = (articles) => {
    let res = [];
    articles.forEach( (v , k) => {
        res[k] =  {
            '_id': v._id,
            'title': v.title,
            'media_type': v.priority,
            'created_at': utils.convertTZ(v.created_at),
            'image': utils.asset(ARTICLE_IMAGE_FOLDER + '/' + v.image),
        }
    } );

    return res;
}