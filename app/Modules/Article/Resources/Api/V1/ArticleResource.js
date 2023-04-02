const utils = require('../../../../../../utils/helpers');
const {ARTICLE_IMAGE_FOLDER} = require('../../../../../Base/Constants/File');

module.exports.make = (category) => {
    return {
        '_id': category._id,
        'title': category.title,
        'body': category.description,
        'created_at': category.created_at,
        'image': utils.asset(ARTICLE_IMAGE_FOLDER + '/' + category.image),
    }
}

module.exports.collection = (categories) => {
    let res = [];
    categories.forEach( (v , k) => {
        res[k] =  {
            '_id': v._id,
            'title': v.title,
            'status': v.status,
            'created_at': v.created_at,
            'image': utils.asset(ARTICLE_IMAGE_FOLDER + '/' + v.image),
        }
    } );

    return res;
}