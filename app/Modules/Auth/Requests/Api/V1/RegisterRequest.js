const Yup = require('yup');
const schema = Yup.object().shape({
    full_name: Yup.string().required('نام الزمالی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    phone: Yup.string().required('شماره همراه الزمالی می باشد').matches(/(0|\\+?\\d{2})(\\d{7,8})/),
    password: Yup.string().min(4).max(240).required('رمز عبور الزامی می باشد'),
    email: Yup.string().email('ادرس ایمیل نامعتبر می باشد'),
    floatingConfirmation: Yup.string().required().oneOf([Yup.ref('password'),null],"رمز عبور وارد شده معتبر نمی باشد"),
});

module.exports = schema;