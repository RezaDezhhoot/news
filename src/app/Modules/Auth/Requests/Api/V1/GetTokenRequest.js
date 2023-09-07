const Yup = require('yup');
const {validPhone , countryCode} = require('../../../../../Base/Constants/Regex');

module.exports = (res) => {
    return Yup.object().shape({
        phone: Yup.string().required(res.__("validation.required",res.__('fields.phone'))).matches(validPhone,{
            message: res.__("validation.pattern",res.__('fields.phone'))
        }),
        country_code: Yup.string().matches(countryCode,{
            message: res.__("validation.pattern",res.__('fields.country_code'))
        }).required(res.__("validation.required",res.__('fields.country_code'))),
    });
};