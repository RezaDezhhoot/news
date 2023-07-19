const Yup = require('yup');
const schema = Yup.object().shape({
    title: Yup.string().required('عنوان الزامی می باشد').max(255,'حداکثر طول برای اسم رعایت نشده است'),
    description: Yup.string(),
    status: Yup.mixed().required('فیلذ وضعیت الزامی می باشد').oneOf(['0','1'],'وضعیت انتخاب شده نامعتبر می باشد'),
    image: Yup.object().shape({
        name: Yup.string(),
        size: Yup.number().max(1024 * 1024 * 50,'حداکثر حجم تصویر 50 مگایایت می باشد'),
        mimetype: Yup.mixed().oneOf(['image/png','image/jpeg','image/jpg'],'تصویر ارسالی نامعتر'),
    })
});

module.exports = schema;