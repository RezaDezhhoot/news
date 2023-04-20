const Yup = require('yup');
const {validPhone} = require("../../../../../Base/Constants/Regex");

const schema = Yup.object().shape({
    full_name: Yup.string().required('نام الزامی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    city: Yup.string().max(255,'حداکثر طول برای شهر رعایت نشده است'),
    phone: Yup.string().required('شماره همراه الزامی می باشد').matches(validPhone,{
        message: 'شماره همراه نامعتبر'
    }),
    password: Yup.string().min(6,'حداقل طول برای رمز عبور 6 کاراکتر می باشد').max(240).required('رمز عبور الزامی می باشد'),
    floatingConfirmation: Yup.string().required().oneOf([Yup.ref('password'),null],"رمز عبور وارد شده معتبر نمی باشد"),
});

module.exports = schema;