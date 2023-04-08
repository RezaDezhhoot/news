const Yup = require('yup');
const {validPhone} = require("../../../../../Base/Constants/Regex");
const schema = Yup.object().shape({
    phone: Yup.string().matches(validPhone).required('شماره همراه الزامی می باشد'),
    code: Yup.number().required('کد تایید الزامی می باشد'),
});

module.exports = schema;