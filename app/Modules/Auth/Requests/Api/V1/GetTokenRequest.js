const Yup = require('yup');
const {validPhone , countryCode} = require('../../../../../Base/Constants/Regex');
const schema = Yup.object().shape({
    phone: Yup.string().matches(validPhone,{
        message: 'شماره همراه نامعتبر'
    }).required('شماره همراه الزامی می باشد'),
    country_code: Yup.string().matches(countryCode).required('شماره همراه الزامی می باشد'),
});

module.exports = schema;