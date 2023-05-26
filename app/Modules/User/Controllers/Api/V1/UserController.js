const User = require("../../../Models/User");
const UserResource = require('../../../Resources/Api/V1/UserResource');
const UserRequest = require('../../../Requests/Api/V1/UserRequest');
const utils = require("../../../../../../utils/helpers");
const shortid = require("shortid");
const {USER_PROFILE_IMAGE_FOLDER} = require("../../../../../Base/Constants/File");

module.exports.profile = async (req,res) => {
    const user = await User.findOne({_id:req.userId});

    if (!user) {
        return res.status(404).json({
            message: req.__('general.not_found')
        });
    }

    return res.status(200).json({
        data: UserResource.make(user),
        message: req.__('general.success')
    });
}

module.exports.update = async (req,res) => {
    const errorArr = [];
    try {
        const image = req.files ? req.files.image : {};
        if (req.body.password) {
            await UserRequest(res).validate({...req.body,image}, {
                abortEarly: false,
            });
        } else {
            await UserRequest(res).validate({...req.body,image,password:'1234abc',floatingConfirmation:'1234abc'}, {
                abortEarly: false,
            });
        }

        const user = await User.findOne({_id:req.userId});
        if (!user) {
            return res.status(404).json({
                data: 'user not found',
                message: 'error'
            });
        }

        const {full_name , password , city} = req.body;

        if (image.name) {
            let filename = `${shortid.generate()}${image.name}`;
            filename = await utils.upload(image,filename,USER_PROFILE_IMAGE_FOLDER,true,user.image,1)
            user.image = `${filename}`;
        }

        user.full_name = full_name;
        user.city = city;
        if (password) {
            user.password = password;
        }
        await user.save();
        return res.status(200).json({
            data: UserResource.make(user),
            message: req.__('general.success')
        });
    } catch (e) {
        const errors = utils.getErrors(e);
        return res.status(errors.status).json({ data: errors.errors, message: req.__('general.error') });
    }
}