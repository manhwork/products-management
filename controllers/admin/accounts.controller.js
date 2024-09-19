const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const md5 = require("md5");
const Role = require("../../models/roles.model");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find({
        deleted: false,
    }).select("-password -token");

    for (const record of records) {
        record.role = await Role.findOne({
            deleted: false,
            _id: record.role_id,
        });
    }

    res.render("admin/pages/accounts/index.pug", {
        pageTitle: "Quản lý tài khoản",
        records: records,
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/accounts/create.pug", {
        pageTitle: "Tạo tài khoản",
        roles: roles,
    });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);
        const emailExist = await Account.findOne({
            deleted: false,
            email: req.body.email,
        });
        if (emailExist) {
            req.flash("success", `Email ${req.body.email} đã tồn tại !`);
            res.redirect("back");
        } else {
            const records = new Account(req.body);
            await records.save();
            req.flash("success", `Tạo tài khoản thành công !`);
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
    } catch (error) {
        req.flash("error", `Tạo tài khoản thất bại !`);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};
