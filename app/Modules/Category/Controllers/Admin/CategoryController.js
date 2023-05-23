const path = require("path");
const utils = require('../../../../../utils/helpers');
const {CATEGORY_IMAGE_FOLDER} = require('../../../../Base/Constants/File');
const CategoryRequest = require('../../Requests/Admin/CategoryRequest');
const shortid = require('shortid');
const Category = require("../../Models/Category");

module.exports.index = async (req , res) => {
    const page = +req.query.page || 1;
    const PerPage = 10;
    let categories , itemNumbers;

    if (req.query.search) {
        categories = await Category.find({title: {$regex: '.*' + req.query.search + '.*'}}).sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
        itemNumbers = await Category.find({title: {$regex: '.*' + req.query.search + '.*'}}).countDocuments();
    } else {
        categories = await Category.find().sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
        itemNumbers = await Category.find().countDocuments();
    }

    res.render(path.join('admin/categories/index'),{
        page_title:'مدیریت دسته بندی ها',
        path: "index",
        active: "categories",
        has_action: true,
        action_url : 'categories/create',
        action_title : 'دسته بندی جدید',
        categories,
        formatDate:utils.formatDate,
        currentPage: page,
        nextPage: page + 1,
        prePage: page-1,
        hasNextPage: PerPage * page < itemNumbers,
        hasPrePage: page>1,
        lastPage: Math.ceil(itemNumbers/PerPage),
        search:req.query.search,
        asset: utils.asset,
        message: req.flash("success_msg"),
        error:{},
        CATEGORY_IMAGE_FOLDER
    });
}

module.exports.create = (req , res) => {
    res.render(path.join('admin/categories/create'),{
        page_title:' مدیریت دسته بندی ها '+ ' | ' + 'دسته جدید',
        path: "create",
        active: "categories",
        has_action: false,
        error: req.flash("error"),
        message: req.flash("success_msg"),
        oldData: req.flash("oldData")[0],
        asset: utils.asset,
    });
}

module.exports.store = async (req , res) => {
    try {
        const image = req.files ? req.files.image : {};
        const {title, status , description}  = req.body;
        req.flash("oldData",{title,status,description});

        await CategoryRequest.validate({...req.body,image},{
            abortEarly: false
        });

        let filename = null;
        if (image.name) {
            filename = `${shortid.generate()}${image.name}`;
            filename = await utils.upload(image,filename,CATEGORY_IMAGE_FOLDER)
        }

        await Category.create({
            title , description , status , image: filename, created_at: Date.now()
        });

    } catch (e) {
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
        return res.redirect(`/admin/categories/create`);
    }

    req.flash("success_msg",'اظلاعات با موفقیت ذحیره شد');
    req.flash("oldData",null);
    return res.redirect(`/admin/categories`);
}

module.exports.edit = async (req , res) => {
    try {
        const category = await Category.findOne({_id: req.params.id});
        if (!category) {
            return utils.abort(404,res);
        }

        res.render(path.join('admin/categories/edit'),{
            page_title:' مدیریت دسته بندی ها '+ ' | ' + category.title,
            path: "edit",
            active: "categories",
            has_action: false,
            category,
            error: req.flash("error"),
            message: req.flash("success_msg"),
            oldData: req.flash("oldData")[0],
            asset: utils.asset,
            CATEGORY_IMAGE_FOLDER
        });
    } catch (e) {
        return utils.abort(404,res);
    }
}

module.exports.update = async (req , res) => {
    try {
        const image = req.files ? req.files.image : {};
        const {title , description , status}  = req.body;

        req.flash("oldData",{title,description,status});

        const category = await Category.findOne({_id: req.params.id});
        if (!category) {
            return utils.abort(404,res);
        }

        await CategoryRequest.validate({...req.body,image},{
            abortEarly: false
        });

        if (image.name) {
            let filename = `${shortid.generate()}${image.name}`;
            filename = await utils.upload(image,filename,CATEGORY_IMAGE_FOLDER,true,category.image,40)
            category.image = filename;
        }
        category.title = title;
        category.status = status;
        category.description = description;
        await category.save();
    } catch (e) {
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
    }
    req.flash("success_msg",'اظلاعات با موفقیت ذحیره شد');
    req.flash("oldData",null);
    return res.redirect(`/admin/categories/edit/${req.params.id}`);
}

module.exports.destroy = async (req , res) => {
    await Category.findOneAndDelete({_id:req.params.id});
    return res.redirect('/admin/categories');
}