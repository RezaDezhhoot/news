const Yup = require('yup');
const schema = Yup.object().shape({
    title: Yup.string().required('عنوان الزامی می باشد').max(255,'حداکثر طول برای عنوان رعایت نشده است'),
    sub_title: Yup.string().max(255,'حداکثر طول برای زیر عنوان رعایت نشده است'),
    status: Yup.mixed().required('فیلذ وضعیت الزامی می باشد').oneOf(['0','1'],'وضعیت انتخاب شده نامعتبر می باشد'),
    color:Yup.string(),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 3,'حداکثر حجم تصویر 3 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],'تصویر ارسالی نامعتر'),
    })
});

module.exports = schema;