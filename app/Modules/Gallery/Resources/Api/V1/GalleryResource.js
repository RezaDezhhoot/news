const utils = require('../../../../../../utils/helpers');
const {GALLERY_IMAGE_FOLDER} = require('../../../../../Base/Constants/File');

module.exports.collection = (galleries) => {
    let res = [];
    galleries.forEach( (v , k) => {
        res[k] =  {
            '_id': v._id,
            'title': v.title,
            'image': utils.asset(GALLERY_IMAGE_FOLDER + '/' + v.image),
            'created_at': utils.convertTZ(v.created_at),
        }
    } );

    return res;
}