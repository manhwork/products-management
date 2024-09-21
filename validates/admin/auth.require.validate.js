const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const Role = require("../../models/roles.model");

module.exports.authRequire = async (req, res, next) => {
    // console.log(req.cookies.token);
    const token = req.cookies.token;

    const user = await Account.findOne({
        token: token,
    });

    if (!token || !user) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const role = await Role.findOne({
        _id: user.role_id,
    }).select("id title permissions");
    // ta có thể sử dụng res thay cho app.locals
    res.locals.user = user;
    res.locals.role = role;

    next();
};
