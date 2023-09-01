const Yup = require('yup');
const I18n = require("../../../../../config/i18n");
const schema = Yup.object().shape({
    title: Yup.string().required(I18n.__("validation.required",I18n.__('admin.fields.title')))
        .max(255,I18n.__("validation.max",I18n.__('admin.fields.title'),255)),
    description: Yup.string(),
    status: Yup.mixed().required(I18n.__("validation.required",I18n.__('admin.fields.status')))
        .oneOf(['0','1'],I18n.__("validation.matches",I18n.__('admin.fields.status'))),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 50,I18n.__("validation.max_size",I18n.__('admin.fields.image'),50)),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],I18n.__("validation.matches",I18n.__('admin.fields.image'))),
    })
});

module.exports = schema;