const Article = require("../../Models/Article");
const path = require("path");
const utils = require("../../../../../utils/helpers");
const {ARTICLE_IMAGE_FOLDER} = require("../../../../Base/Constants/File");
const ArticleRequest = require("../../Requests/Admin/ArticleRequest");
const shortid = require("shortid");

module.exports.index = async (req , res) => {
    const page = +req.query.page || 1;
    const PerPage = 10;
    let articles , itemNumbers;

    if (req.query.search) {
        articles = await Article.find({title: {$regex: '.*' + req.query.search + '.*'}}).sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
        itemNumbers = await Article.find({title: {$regex: '.*' + req.query.search + '.*'}}).countDocuments();
    } else {
        articles = await Article.find().sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
        itemNumbers = await Article.find().countDocuments();
    }

    res.render(path.join('admin/articles/index'),{
        page_title:'مدیریت مقالات',
        path: "index",
        active: "articles",
        has_action: true,
        action_url : 'articles/create',
        action_title : 'مقاله جدید',
        articles,
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
        ARTICLE_IMAGE_FOLDER
    });
}

module.exports.create = (req , res) => {
    res.render(path.join('admin/articles/create'),{
        page_title:' مدیریت دسته بندی ها '+ ' | ' + 'دسته جدید',
        path: "create",
        active: "articles",
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

        await ArticleRequest.validate({...req.body,image},{
            abortEarly: false
        });

        let filename = null;
        if (image.name) {
            filename = `${shortid.generate()}${image.name}`;
            filename = await utils.upload(image,filename,ARTICLE_IMAGE_FOLDER)
        }

        await Article.create({
            title , description , status , image: filename , created_at: Date.now()

        });

    } catch (e) {
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
        return res.redirect(`/admin/articles/create`);
    }

    req.flash("success_msg",'اظلاعات با موفقیت ذحیره شد');
    req.flash("oldData",null);
    return res.redirect(`/admin/articles`);
}

module.exports.edit = async (req , res) => {
    try {
        const article = await Article.findOne({_id: req.params.id});
        if (!article) {
            return utils.abort(404,res);
        }

        res.render(path.join('admin/articles/edit'),{
            page_title:' مدیریت  مقالات '+ ' | ' + article.title,
            path: "edit",
            active: "articles",
            has_action: false,
            article,
            error: req.flash("error"),
            message: req.flash("success_msg"),
            oldData: req.flash("oldData")[0],
            asset: utils.asset,
            ARTICLE_IMAGE_FOLDER
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

        const article = await Article.findOne({_id: req.params.id});
        if (!article) {
            return utils.abort(404,res);
        }

        await ArticleRequest.validate({...req.body,image},{
            abortEarly: false
        });

        if (image.name) {
            let filename = `${shortid.generate()}${image.name}`;
            filename = await utils.upload(image,filename,ARTICLE_IMAGE_FOLDER,true,article.image)
            article.image = filename;
        }
        article.title = title;
        article.status = status;
        article.description = description;
        await article.save();
    } catch (e) {
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
    }
    req.flash("success_msg",'اظلاعات با موفقیت ذحیره شد');
    req.flash("oldData",null);
    return res.redirect(`/admin/articles/edit/${req.params.id}`);
}

module.exports.destroy = async (req , res) => {
    await Article.findOneAndDelete({_id:req.params.id});
    return res.redirect('/admin/articles');
}