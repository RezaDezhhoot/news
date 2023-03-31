const Yup = require('yup');
const schema = Yup.object().shape({
    full_name: Yup.string().required('نام الزامی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 3,'حداکثر حجم تصویر 3 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],'تصویر ارسالی نامعتر'),
    }),
    password: Yup.string().min(6,'حداقل طول برای رمز عبور 6 حرف می باشد').max(240).required('رمز عبور الزامی می باشد'),
    floatingConfirmation: Yup.string().required().oneOf([Yup.ref('password'),null],"رمز عبور وارد شده معتبر نمی باشد"),
});

module.exports = schema;