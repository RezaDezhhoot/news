const utils = require('../../../../../../utils/helpers');
const {CHANNEL_IMAGE_FOLDER} = require('../../../../../Base/Constants/File');

module.exports.make = (channel) => {
    return {
        '_id': channel._id,
        'title': channel.title,
        'sub_title': channel.sub_title,
        'created_at': utils.convertTZ(channel.created_at),
        'color': channel?.color,
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
            'created_at': utils.convertTZ(v.created_at),
            'color': v?.color,
            'image': utils.asset(CHANNEL_IMAGE_FOLDER + '/' + v.image),
        }
    } );

    return res;
}