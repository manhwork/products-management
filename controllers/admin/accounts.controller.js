const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Quản lý tài khoản",
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
    });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        const records = new Account(req.body);
        await records.save();
        req.flash("success", `Tạo tài khoản thành công !`);
    } catch (error) {
        req.flash("error", `Tạo tài khoản thất bại !`);
    }
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};
