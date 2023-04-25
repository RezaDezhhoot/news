const path = require("path");
const User = require("../../../User/Models/User");
const utils = require('../../../../../utils/helpers');
const UserRequest = require('../../Requests/Admin/UserRequest');
const {USER_PROFILE_IMAGE_FOLDER} = require('../../../../Base/Constants/File');
const shortid = require('shortid');
const RoleConst = require('../../../../Base/Constants/Role');

exports.index = async (req,res) => {
    const page = +req.query.page || 1;
    const userPerPage = 10;
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
        const {full_name  , password , role , status , city}  = req.body;

        req.flash("oldData",{full_name,role,status});

        const user = await User.findOne({_id: req.params.id});
        if (!user) {
            return utils.abort(404,res);
        }

        if (user.role === RoleConst.ADMINSTRATOR) {
            await UserRequest.validate({...req.body,role:RoleConst.ADMINSTRATOR,image},{
                abortEarly: false
            });
        } else {
            await UserRequest.validate({...req.body,image},{
                abortEarly: false
            });
        }

        if (image.name) {
            const filename = `${shortid.generate()}${image.name}`;
            await utils.upload(image,filename,USER_PROFILE_IMAGE_FOLDER,true,user.image)
            user.image = `${filename}`;
        }

        user.full_name = full_name;
        user.city = city;
        if (user.role !== RoleConst.ADMINSTRATOR && role !== RoleConst.ADMINSTRATOR) {
            user.role = role;
        }
        user.status = status;

        if (password) {
            user.password = password;
        }
        await user.save();
    } catch (e) {
        console.log(e);
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
    }

    req.flash("success_msg",'اظلاعات با موفقیت ذحیره شد');
    req.flash("oldData",null);
    return res.redirect(`/admin/edit/${req.params.id}`);
}

exports.destroy = async (req,res) => {
    const user = await User.findOne({$and:[
            {_id:req.params.id},
        ]});

    if (!user || user.role === RoleConst.ADMINSTRATOR) {
        return utils.abort(404,res);
    }
    await User.findOneAndDelete({_id:req.params.id});
    return res.redirect('/admin');
}
