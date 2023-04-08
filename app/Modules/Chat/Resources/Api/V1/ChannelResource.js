const utils = require('../../../../../../utils/helpers');
const {CHANNEL_IMAGE_FOLDER} = require('../../../../../Base/Constants/File');

module.exports.make = (channel) => {
    return {
        '_id': channel._id,
        'title': channel.title,
        'sub_title': channel.sub_title,
        'created_at': channel.created_at,
        'image': utils.asset(CHANNEL_IMAGE_FOLDER + '/' + channel.image),
    }
}

module.exports.collection = (channels) => {
    let res = [];
    channels.forEach( (v , k) => {
        res[k] =  {
            '_id': v._id,
            'title': v.title,
            'sub_title': v.sub_title,
            'created_at': v.created_at,
            'image': utils.asset(CHANNEL_IMAGE_FOLDER + '/' + v.image),
        }
    } );

    return res;
}