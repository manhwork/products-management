const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const md5 = require("md5");
// [GET] /admin/my-account

module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Thông tin tài khoản",
    });
};

// [GET] /admin/my-account/edit

module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit.pug", {
        pageTitle: "Chỉnh sửa thông tin",
    });
};

// [PATCH] /admin/my-account/edit

module.exports.editPatch = async (req, res) => {
    const find = {
        deleted: false,
        _id: res.locals.user.id,
    };
    try {
        const emailExist = await Account.findOne({
            deleted: false,
            email: req.body.email,
            _id: { $ne: res.locals.user.id },
        });
        if (emailExist) {
            req.flash("error", `Đã tồn tại email ${req.body.email} !`);
            res.redirect("back");
        } else {
            if (!req.body.password) {
                delete req.body.password;
            } else {
                req.body.password = md5(req.body.password);
            }
            const updatedBy = {
                account_id: res.locals.user.id,
            };
            await Account.updateOne(find, {
                ...req.body,
                $push: { updatedBy: updatedBy },
            });
            req.flash(
                "success",
                `Cập nhật tài khoản ${req.body.email} thành công`
            );
            res.redirect("back");
        }
    } catch (error) {
        req.flash("error", `Cập nhật tài khoản ${req.body.email} thất bại !`);
        res.redirect("back");
    }
};
