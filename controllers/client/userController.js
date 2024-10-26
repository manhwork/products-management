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
