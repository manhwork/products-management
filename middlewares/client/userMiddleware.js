const User = require("../../models/users.model");

module.exports.userInfo = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    if (tokenUser) {
        const user = await User.findOne({
            tokenUser: tokenUser,
            status: "active",
            deleted: false,
        });
        if (user) {
            res.locals.user = user;
        }
    }

    next();
};
