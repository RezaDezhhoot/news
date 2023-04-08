const Yup = require('yup');
const {validPhone, countryCode} = require("../../../../../Base/Constants/Regex");
const schema = Yup.object().shape({
    phone: Yup.string().matches(validPhone).required('شماره همراه الزامی می باشد'),
    code: Yup.number().required('کد تایید الزامی می باشد'),
    password: Yup.string().min(6,'حداقل طول برای رمز عبور 6 حرف می باشد').max(240).required('رمز عبور الزامی می باشد'),
    floatingConfirmation: Yup.string().required().oneOf([Yup.ref('password'),null],"رمز عبور وارد شده معتبر نمی باشد"),
});

module.exports = schema;