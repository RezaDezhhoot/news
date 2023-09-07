const utils = require('../../../../../../utils/helpers');
const {GALLERY_IMAGE_FOLDER, GALLERY_VIDEO_FOLDER} = require('../../../../../Base/Constants/File');
const {IMAGE, VIDEO} = require("../../../Enums/Priority");

module.exports.collection = (galleries) => {
    let res = [];
    let priority;
    galleries.forEach( (v , k) => {
        priority = v.priority ?? IMAGE;
        res[k] =  {
            '_id': v._id,
            'title': v.title,
            'media_type': priority,
            'media': priority === VIDEO ? ( v?.video ? utils.asset(GALLERY_VIDEO_FOLDER + '/' + v?.video) : null) : v.image ? utils.asset(GALLERY_IMAGE_FOLDER + '/' + v.image) : null,
            'image': v.image ? utils.asset(GALLERY_IMAGE_FOLDER + '/' + v.image) : null,
            'created_at': utils.convertTZ(v.created_at),
        }
    } );

    return res;
}