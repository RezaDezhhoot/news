const utils = require('../../../../../../utils/helpers');
const {CATEGORY_IMAGE_FOLDER} = require('../../../../../Base/Constants/File');
const Gallery = require('../../../../Gallery/Models/Gallery');

module.exports.make = (category) => {

}

module.exports.collection = async (categories) => {
    let res = [];
    for (const v of categories) {
        const k = categories.indexOf(v);
        res[k] =  {
            '_id': v._id,
            'title': v.title,
            'description': v.description,
            'created_at': v.created_at,
            'image': utils.asset(CATEGORY_IMAGE_FOLDER + '/' + v.image),
            'items_count': await Gallery.find({category: v._id}).countDocuments()
        }
    }

    return res;
}