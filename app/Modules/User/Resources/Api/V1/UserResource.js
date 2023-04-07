const {USER_PROFILE_IMAGE_FOLDER} = require('../../../../../Base/Constants/File');
const utils = require('../../../../../../utils/helpers');

exports.make = (user , token = null , ignore = []) => {
    ignore.forEach((v , k) => {
        user[v] = undefined;
    });

    return {
        _id: user._id,
        full_name: user.full_name,
        phone: user.phone,
        image: utils.asset(USER_PROFILE_IMAGE_FOLDER + '/' + user.image),
        status: user.status,
        role: user.role,
        token: token ? token : undefined
    };
}