const utils = require('../../../../../../utils/helpers');
const {CATEGORY_IMAGE_FOLDER} = require('../../../../../Base/Constants/File');

module.exports.make = (category) => {

}

module.exports.collection = (categories) => {
    let res = [];
    categories.forEach( (v , k) => {
        res[k] =  {
            '_id': v._id,
            'title': v.title,
            'description': v.description,
            'image': utils.asset(CATEGORY_IMAGE_FOLDER + '/' + v.image),
        }
    } );

    return res;
}