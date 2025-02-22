const Channel = require("../../Models/Channel");
const Chat = require("../../Models/Chat");
const path = require("path");
const utils = require("../../../../../utils/helpers");
const {CHANNEL_IMAGE_FOLDER, ARTICLE_IMAGE_FOLDER} = require("../../../../Base/Constants/File");
const ChannelRequest = require("../../Requests/Admin/ChannelRequest");
const shortid = require("shortid");

module.exports.index = async (req , res) => {
    const page = +req.query.page || 1 , PerPage = 10;
    let channels , itemNumbers  , options = {};

    if (req.query.search)
        options = { $and: [{title: {$regex: '.*' + req.query.search + '.*'}}] };

    channels = await Channel.find(options).sort([['created_at', 'descending']]).skip((page-1)*PerPage).limit(PerPage);
    itemNumbers = await Channel.find(options).countDocuments();

    res.render(path.join('admin/channels/index'),{
        page_title: res.__('admin.channels.title'),
        path: "index",
        active: "channels",
        has_action: true,
        action_url : 'channels/create',
        action_title : res.__('admin.channels.create'),
        channels,
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
        CHANNEL_IMAGE_FOLDER,
        language: utils.getLocale(req),
        direction: utils.getDirection(req),
        assetsDirection: utils.getAssetsDirection(req),
    });
}

module.exports.create = async (req , res) => {
    res.render(path.join('admin/channels/create'),{
        page_title: res.__('admin.channels.create'),
        path: "create",
        active: "channels",
        has_action: false,
        error: req.flash("error"),
        message: req.flash("success_msg"),
        oldData: req.flash("oldData")[0],
        asset: utils.asset,
        direction: utils.getDirection(req),
        assetsDirection: utils.getAssetsDirection(req),
    });
}

module.exports.store = async (req , res) => {
    try {
        const image = req.files ? req.files.image : {};
        const {title, status , sub_title , color}  = req.body;
        req.flash("oldData",{title,status,color,sub_title});

        await ChannelRequest.validate({...req.body,image},{
            abortEarly: false
        });

        let filename = null;
        if (image.name) {
            filename = `${shortid.generate()}${image.name}`;
            filename = await utils.upload(image,filename,CHANNEL_IMAGE_FOLDER)
        }

        await Channel.create({
            title , sub_title , status , color , image: filename
        });

    } catch (e) {
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
        return res.redirect(`/admin/channels/create`);
    }

    req.flash("success_msg",res.__('admin.general.messages.saved'));
    req.flash("oldData",null);
    return res.redirect(`/admin/channels`);
}

module.exports.edit = async (req , res) => {
    try {
        const channel = await Channel.findOne({_id: req.params.id});
        if (!channel) {
            return utils.abort(404,res);
        }

        res.render(path.join('admin/channels/edit'),{
            page_title: res.__('admin.channels.title') + ' | ' + channel.title,
            path: "edit",
            active: "channels",
            has_action: false,
            channel,
            error: req.flash("error"),
            message: req.flash("success_msg"),
            oldData: req.flash("oldData")[0],
            asset: utils.asset,
            CHANNEL_IMAGE_FOLDER,
            direction: utils.getDirection(req),
            assetsDirection: utils.getAssetsDirection(req),
        });
    } catch (e) {
        return utils.abort(404,res);
    }
}

module.exports.update = async (req , res) => {
    try {
        const image = req.files ? req.files.image : {};
        const {title  , status , color , sub_title}  = req.body;

        req.flash("oldData",{title,status , color,sub_title});

        const channel = await Channel.findOne({_id: req.params.id});
        if (! channel) {
            return utils.abort(404,res);
        }

        await ChannelRequest.validate({...req.body,image},{
            abortEarly: false
        });

        if (image.name) {
            let filename = `${shortid.generate()}${image.name}`;
            filename = await utils.upload(image,filename,CHANNEL_IMAGE_FOLDER,true,channel.image)
            channel.image = filename;
        }
        channel.title = title;
        channel.sub_title = sub_title;
        channel.status = status;
        channel.color = color;
        await channel.save();
    } catch (e) {
        const errors = utils.getErrors(e);
        req.flash("error",errors['errors']);
    }
    req.flash("success_msg",res.__('admin.general.messages.saved'));
    req.flash("oldData",null);
    return res.redirect(`/admin/channels/edit/${req.params.id}`);
}

module.exports.destroy = async (req , res) => {
    await Chat.deleteMany({channel: req.params.id});
    await Channel.findOneAndDelete({_id:req.params.id});
    return res.redirect('/admin/channels');
}