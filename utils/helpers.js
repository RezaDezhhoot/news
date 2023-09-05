const jwt = require("jsonwebtoken");
const moment = require('jalali-moment');
const path = require("path");
const appDir = path.dirname(require.main.filename);
const fs = require('fs');
const sharp = require("sharp");
const multer = require('multer');
const User = require('../app/Modules/User/Models/User');
const Redis = require("../app/Libraries/Redis");

module.exports.normalizeIranianPhoneNumber = (phone) => {
    return phone.startsWith('9') ? '0'+phone :  phone;
}

module.exports.normalizePhoneNumber = (country_code,phone) => {
    country_code = this.normalizeCountryCallingCode(country_code);
    return phone.startsWith('09') ? country_code + phone.substring(1) : country_code+phone;
}

module.exports.normalizeCountryCallingCode = (country_code) => {
    return country_code.startsWith('+') ?  country_code.replace('+','00') :  country_code;
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
            filed: 'Server error',
            message: exception
        });
    }

    return {
        errors: errorArr,
        status
    };
}

module.exports.makeToken = (user) => {
    return jwt.sign({
            user: { _id: user._id.toString(), phone: user.phone }
        }, process.env.JWT_SECRET
    );
}

exports.formatDate = (date , local = null) => {
    return moment(date).locale(local).format("D MMM YYYY");
}

exports.abort = (code,res) => {
    return res.render(`errors/${code}.ejs`,{
        layout: path.join(appDir,'resources','views','layouts','error'),
    });
}

exports.upload = async (file , filename , folder , with_delete_old = false , old= null , quality = 40) => {
    const uploadPath = `${appDir}/public/storage/${folder}`;
    if (!fs.existsSync(uploadPath)) {
        await fs.promises.mkdir(uploadPath, { recursive: true })
    }
    const file_ext = path.extname(file.name);
    let file_name;
    if (with_delete_old && old) {
        fs.unlink(`${uploadPath}/${old}`,async (err) => {
            if (err) console.log(err);
        });
        file_name = await this.uploadFIle(file,quality,uploadPath,filename,file_ext);
    } else {
        file_name = await this.uploadFIle(file,quality,uploadPath,filename,file_ext);
    }
    return file_name;
}

exports.uploadFIle = async (file , quality , uploadPath , filename , file_ext) => {
    let file_name;
    switch (file_ext) {
        case '.PNG':
        case '.png':
            await sharp(file.data).png({quality})
                .toFile(`${uploadPath}/${filename}`).catch(err => {
                console.log(err);
            });
            return filename;
        case '.JPG':
        case '.jpg':
            file_name = filename.replace(file_ext,'')+'.jpeg';
            await sharp(file.data).toFormat('jpeg').jpeg({quality})
                .toFile(`${uploadPath}/${file_name}`).catch(err => {
                console.log(err);
            });
            return file_name;
        case '.JPEG':
        case '.jpeg':
            await sharp(file.data).jpeg({quality})
                .toFile(`${uploadPath}/${filename}`).catch(err => {
                console.log(err);
            });
            return filename;
        case '.flv':
        case '.wmv':
        case '.avi':
        case '.mp4':
            file.mv(`${uploadPath}/${filename}`);
            return filename;
    }
}

exports.asset = (file) => {
    return `${process.env.APP_URL}/storage/${file}`;
}

exports.getLocale = (req = null) => {
    return req?.query.lang ?? req?.cookies.lang ?? null;
}

exports.getDirection = (req = null) => {
    if (this.getLocale(req) === 'fa') {
        return 'rtl';
    }
    return 'ltr';
}

exports.getAssetsDirection = (req = null) => {
    if (this.getLocale(req) === 'fa') {
        return '.rtl';
    }
    return '';
}

exports.findUserByToken = async (data) => {
    const token = data.token.split(" ")[1];

    if (token) {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.userId);
        return user;
    } else {
        return false;
    }
}

exports.convertTZ = (date) => {
    return date
}

exports.clearCache = async (key) => {
    await Redis.connect();

    let keys = await Redis.keys(key, function(err , keys)  {
        return keys;
    });
    if (keys.length > 0) {
        await Redis.del(keys);
    }
    await Redis.disconnect();
}

exports.redis_flush = async () => {
    await Redis.connect();

    await Redis.flushAll();

    await Redis.disconnect();
}