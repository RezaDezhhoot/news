const Yup = require('yup');
const {validPhone} = require("../../../../Base/Constants/Regex");
const I18n = require('../../../../../config/i18n');

const schema = Yup.object().shape({
    phone: Yup.string().required(I18n.__("validation.required",I18n.__('fields.phone'))).matches(validPhone,{
        message: I18n.__("validation.pattern",I18n.__('fields.phone'))
    }),
    code: Yup.number().required(I18n.__("validation.required",I18n.__('fields.code'))),
    password: Yup.string().min(6,I18n.__("validation.min",I18n.__('fields.password'),6)).max(240,I18n.__("validation.max",I18n.__('fields.name'),240)).required(I18n.__("validation.required",I18n.__('fields.password'))),
    floatingConfirmation: Yup.string().required(I18n.__("validation.required",I18n.__('fields.floating_confirmation'))).oneOf([Yup.ref('password'),null],I18n.__("validation.matches",I18n.__('fields.password'))),
});

module.exports = schema;