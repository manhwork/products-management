const Account = require("../../models/accounts.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");
// [GET] /admin/auth/login

module.exports.login = async (req, res) => {
    res.render("admin/pages/auth/login.pug", {
        pageTitle: "Trang đăng nhập",
    });
};

// [POST] /admin/auth/login

module.exports.loginPost = async (req, res) => {
    const data = await Account.findOne({
        deleted: false,
        email: req.body.email,
    });

    if (!data) {
        req.flash("error", `Không tìm thấy email !`);
        res.redirect("back");
        return;
    }

    if (data.password !== md5(req.body.password)) {
        req.flash("error", "Sai mật khẩu !");
        res.redirect("back");
        return;
    }

    // Thêm token vào cookie
    res.cookie("token", data.token);
    req.flash("success", "Đăng nhập thành công !");
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout

module.exports.logout = async (req, res) => {
    // Xóa token khi đăng xuất
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
