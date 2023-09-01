const Yup = require('yup');
const {VIDEO, IMAGE} = require("../../Enums/Priority");
const I18n = require("../../../../../config/i18n");
const schema = Yup.object().shape({
    title: Yup.string().required(I18n.__("validation.required",I18n.__('admin.fields.title')))
        .max(255,I18n.__("validation.max",I18n.__('admin.fields.title'),255)),
    category: Yup.string(),
    status: Yup.mixed().required(I18n.__("validation.required",I18n.__('admin.fields.status')))
        .oneOf(['0','1'],I18n.__("validation.matches",I18n.__('admin.fields.status'))),
    priority: Yup.mixed().required(I18n.__("validation.required",I18n.__('admin.fields.view'))).oneOf([VIDEO,IMAGE],I18n.__("validation.matches",I18n.__('admin.fields.view'))),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 50,I18n.__("validation.max_size",I18n.__('admin.fields.image'),50)),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],I18n.__("validation.matches",I18n.__('admin.fields.image'))),
    }),
    video: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 100,I18n.__("validation.max_size",I18n.__('admin.fields.video'),100)),
        mimetype: Yup.mixed().oneOf(['video/mp4','video/x-msvideo','video/x-flv','video/x-ms-wmv'],I18n.__("validation.matches",I18n.__('admin.fields.video'))),
    }),
});

module.exports = schema;