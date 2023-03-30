module.exports.normalizeIranianPhoneNumber = (phone) => {
    return phone.startsWith('0') || phone.startsWith('98') ? phone : '0' + phone;
}

module.exports.getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports.getErrors = (exception) => {
    const errorArr = [];
    let status = 500;
    if (typeof exception.inner !== "undefined") {
        exception.inner.forEach(e => {
            errorArr.push({
                filed: e.path,
                message: e.message
            });
        });
        status = 422;
    } else {
        errorArr.push({
            filed: 'unKnow',
            message: exception
        });
    }

    return {
        errors: errorArr,
        status
    };
}