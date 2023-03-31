const path = require("path");
const User = require("../../../User/Models/User");
const utils = require('../../../../../utils/helpers');
const UserRequest = require('../../Requests/Admin/UserRequest');
const {USER_PROFILE_IMAGE_FOLDER} = require('../../../../Base/Constants/File');
const shortid = require('shortid');

exports.index = async (req,res) => {
    const page = +req.query.page || 1;
    const userPerPage = 12;
    let users , userNumbers;
    if (req.query.search) {
        users = await User.find({phone: {$regex: '.*' + req.query.search + '.*'}}).sort([['created_at', 'descending']]).skip((page-1)*userPerPage).limit(userPerPage);
        userNumbers = await User.find({phone: {$regex: '.*' + req.query.search + '.*'}}).countDocuments();
    } else {
        users = await User.find().sort([['created_at', 'descending']]).skip((page-1)*userPerPage).limit(userPerPage);
        userNumbers = await User.find().countDocuments();
    }

    res.render(path.join('admin/users/index'),{
        page_title:'مدیریت کاربران',
        path: "index",
        active: "users",
        has_action: false,
        users,
        formatDate:utils.formatDate,
        currentPage: page,
        nextPage: page + 1,
        prePage: page-1,
        hasNextPage: userPerPage * page < userNumbers,
        hasPrePage: page>1,
        lastPage: Math.ceil(userNumbers/userPerPage),
        search:req.query.search,
        asset: utils.asset,
        USER_PROFILE_IMAGE_FOLDER
    });
}

exports.edit = async (req,res) => {
    try {
        const user = await User.findOne({_id: req.params.id});
        if (!user) {
            return utils.abort(404,res);
        }

        res.render(path.join('admin/users/edit'),{
            page_title:' مدیریت کاربران '+ ' | ' + user.full_name ?? user.phone,
            path: "edit",
            active: "users",
            has_action: false,
            user,
            error: req.flash("error"),
            message: req.flash("success_msg"),
            oldData: req.flash("oldData")[0],
            asset: utils.asset,
            USER_PROFILE_IMAGE_FOLDER
        });
    } catch (e) {
        return utils.abort(404,res);
    }
}

exports.update = async (req,res) => {
    try {
        const image = req.files ? req.files.image : {};
        const phone = utils.normalizeIranianPhoneNumber(req.body.phone);
        const {full_name , email , password , role , status}  = req.body;

        req.flash("oldData",{full_name,email,phone,role,status});

        await UserRequest.validate({...req.body,image},{
           abortEarly: false
        });

        const user = await User.findOne({_id: req.params.id});
        if (!user) {
            return utils.abort(404,res);
        }


        if (phone !== user.phone) {
            if (await User.findOne({ $and:[
                    {phone},
                ] })) {
                throw 'کاربری با این شماره وجود دارد';
            }
            user.phone = phone;
        }

        if (email !== user.email) {
            if (await User.findOne({ $and:[
                    {email},
                ] })) {
                throw 'کاربری با این ایمیل وجود دارد';
            }
            user.email = email;
        }


        if (image.name) {
            const filename = `${shortid.generate()}${image.name}`;
            await utils.upload(image,filename,USER_PROFILE_IMAGE_FOLDER,true,user.image)
            user.image = `${filename}`;
        }

        user.full_name = full_name;
        user.role = role;
        user.status = status;

        if (password) {
            user.password = password;
        }
        await user.save();
    } catch (e) {
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
    }

    req.flash("success_msg",'اظلاعات با موفقیت ذحیره شد');
    return res.redirect(`/admin/edit/${req.params.id}`);
}

exports.destroy = async (req,res) => {
    await User.findByIdAndRemove(req.params.id);
    return res.redirect('/admin');
}
