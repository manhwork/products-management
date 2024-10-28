const User = require("../../models/users.model");

const md5 = require("md5");
// [GET] /user/register

module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kí tài khoản",
    });
};

// [POST] /user/register

module.exports.registerPost = async (req, res) => {
    const emailExist = await User.findOne({
        email: req.body.email,
    });
    console.log(emailExist);
    if (emailExist) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("/user/register");
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    req.flash("success", "Đăng kí tài khoản thành công");
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
};

// [GET] /user/login

module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
    });
};

// [POST] /user/login

module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (!user) {
        req.flash("error", "Email không tồn tại ");
        res.redirect("back");
        return;
    }
    if (md5(req.body.password) !== user.password) {
        req.flash("error", "Mật khẩu không đúng");
        res.redirect("back");
        return;
    }
    if (user.status === "inactive") {
        req.flash("error", "Tài khoản đã bị khoá");
        res.redirect("back");
        return;
    }
    req.flash("success", "Đăng nhập thành công");
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
};

// [GET] /user/logout

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
};
