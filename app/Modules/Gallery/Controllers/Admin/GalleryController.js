const path = require("path");
const utils = require('../../../../../utils/helpers');
const {GALLERY_IMAGE_FOLDER, CATEGORY_IMAGE_FOLDER} = require('../../../../Base/Constants/File');
const GalleryRequest = require('../../Requests/Admin/GalleryRequest');
const shortid = require('shortid');
const Gallery = require("../../Models/Gallery");
const Category = require("../../../Category/Models/Category");
const CategoryRequest = require("../../../Category/Requests/Admin/CategoryRequest");

module.exports.index = async (req, res) => {
    const page = +req.query.page || 1;
    const PerPage = 10;
    let galleries , itemNumbers;

    if (req.query.search) {
        galleries = await Gallery.find({title: {$regex: '.*' + req.query.search + '.*'}})
            .populate('category')
            .sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
        itemNumbers = await Gallery.find({title: {$regex: '.*' + req.query.search + '.*'}}).countDocuments();
    } else {
        galleries = await Gallery.find().populate('category').sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
        itemNumbers = await Gallery.find().countDocuments();
    }

    res.render(path.join('admin/galleries/index'),{
        page_title:'مدیریت گالری',
        path: "index",
        active: "galleries",
        has_action: true,
        action_url : 'galleries/create',
        action_title : 'گالری جدید',
        galleries,
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
        GALLERY_IMAGE_FOLDER
    });
}

module.exports.create = async (req, res) => {

    const categories = await Category.find({status:true});

    res.render(path.join('admin/galleries/create'),{
        page_title:' مدیریت گالری '+ ' | ' + 'گالری جدید',
        path: "create",
        active: "galleries",
        categories,
        has_action: false,
        error: req.flash("error"),
        message: req.flash("success_msg"),
        oldData: req.flash("oldData")[0],
        asset: utils.asset,
    });
}

module.exports.store = async (req, res) => {
    try {
        const image = req.files ? req.files.image : {};
        let {title, status , category}  = req.body;
        req.flash("oldData",{title,status,category});

        await GalleryRequest.validate({...req.body,image},{
            abortEarly: false
        });

        let filename = null;
        if (image.name) {
            filename = `${shortid.generate()}${image.name}`;
            await utils.upload(image,filename,GALLERY_IMAGE_FOLDER);
        }

        if (!category) {
            category = undefined;
        }

        await Gallery.create({
            title , category , status , image: filename
        });
    } catch (e) {
        console.log(e);
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
        return res.redirect(`/admin/galleries/create`);
    }

    req.flash("success_msg",'اظلاعات با موفقیت ذحیره شد');
    req.flash("oldData",null);
    return res.redirect(`/admin/galleries`);
}

module.exports.edit = async (req, res) => {
    try {
        const gallery = await Gallery.findOne({_id: req.params.id}).populate('category');
        if (!gallery) {
            return utils.abort(404,res);
        }
        const categories = await Category.find({status:true});

        res.render(path.join('admin/galleries/edit'),{
            page_title:' مدیریت گالری '+ ' | ' + gallery.title,
            path: "edit",
            active: "galleries",
            has_action: false,
            categories,
            gallery,
            error: req.flash("error"),
            message: req.flash("success_msg"),
            oldData: req.flash("oldData")[0],
            asset: utils.asset,
            GALLERY_IMAGE_FOLDER
        });
    } catch (e) {
        return utils.abort(404,res);
    }
}

module.exports.update = async (req, res) => {
    try {
        const image = req.files ? req.files.image : {};
        let {title, status , category}  = req.body;
        req.flash("oldData",{title,status,category});

        await GalleryRequest.validate({...req.body,image},{
            abortEarly: false
        });

        const gallery = await Gallery.findOne({_id: req.params.id});
        if (!gallery) {
            return utils.abort(404,res);
        }

        if (image.name) {
            const filename = `${shortid.generate()}${image.name}`;
            await utils.upload(image,filename,GALLERY_IMAGE_FOLDER,true,gallery.image)
            gallery.image = filename;
        }
        gallery.title = title;
        gallery.status = status;

        if (!category) {
            gallery.category = undefined;
        } else {
            gallery.category = category;
        }
        await gallery.save();
    } catch (e) {
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
    }
    req.flash("success_msg",'اظلاعات با موفقیت ذحیره شد');
    req.flash("oldData",null);
    return res.redirect(`/admin/galleries/edit/${req.params.id}`);
}

module.exports.destroy = async (req, res) => {
    await Gallery.findOneAndDelete({_id:req.params.id});
    return res.redirect('/admin/galleries');
}