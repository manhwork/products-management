const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");

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

    next();
};
