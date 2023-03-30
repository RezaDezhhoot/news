exports.make = (user , token) => {
    return {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        token
    };
}