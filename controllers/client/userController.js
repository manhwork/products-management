const User = require("../../models/users.model");
const ForgotPassword = require("../../models/forgotPasswordModel");
const generrate = require("../../helpers/generate");
const md5 = require("md5");

const sendEmailHelper = require("../../helpers/sendEmail");
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

// [GET] /user/password/forgot
module.exports.passwordForgot = async (req, res) => {
    res.render("client/pages/user/forgotPassword");
};

// [POST] /user/password/forgot

module.exports.passwordForgotPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false,
        status: "active",
    });

    if (!user) {
        req.flash("error", "Không tìm thấy email");
        res.redirect("back");
        return;
    }
    const otp = generrate.generateRandomNumber(6);
    const objectOTP = {
        email: email,
        otp: otp,
        expireAt: new Date() + 1000 * 60 * 3,
    };

    const forgotpassword = new ForgotPassword(objectOTP);
    await forgotpassword.save();

    const subject = "Gửi mã OTP để lấy lại mật khẩu";
    const html = `
    Mã OTP xác thực của bạn: <b>${otp}</b><br>
    Mã OTP có hiệu lực trong 3 phút.<br><br>
    Bạn vui lòng nhập mã OTP này vào trang xác thực để hoàn tất quá trình đăng nhập hoặc thực hiện giao dịch.<br><br>
    Nếu bạn không yêu cầu mã OTP này, có thể ai đó đã nhập nhầm địa chỉ email của bạn. Bạn không cần phải làm gì thêm nếu không có yêu cầu này. Tuy nhiên, nếu bạn nhận thấy các hoạt động đáng ngờ, vui lòng liên hệ với chúng tôi ngay để được hỗ trợ.<br><br>
    Để bảo vệ tài khoản của bạn, chúng tôi khuyến nghị bạn không chia sẻ mã OTP này với bất kỳ ai. Trong trường hợp bạn gặp khó khăn trong việc sử dụng mã OTP, xin vui lòng thử lại hoặc liên hệ với chúng tôi để được giúp đỡ.<br><br>
    Chúng tôi luôn sẵn sàng hỗ trợ bạn. Bạn có thể liên hệ với chúng tôi qua các kênh hỗ trợ khách hàng như điện thoại, email hoặc chat trực tuyến.<br><br>
    Trân trọng,<br>
    Manh Admin
`;

    sendEmailHelper(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otpPassword", {
        email: email,
    });
};

// [POST] /user/password/otp

module.exports.otpPost = async (req, res) => {
    const otp = req.body.otp;
    const email = req.body.email;
    const forgotPassword = await ForgotPassword.findOne({
        email: email,
        otp: otp,
    });

    if (!forgotPassword) {
        req.flash("error", "Mã OTP không hợp lệ");
        res.redirect("back");
        return;
    }
    req.flash("success", "Nhập mã otp thành công");
    const user = await User.findOne({
        email: email,
        deleted: false,
        status: "active",
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/change");
};

// [GET] /user/password/change

module.exports.changePassword = async (req, res) => {
    res.render("client/pages/user/changePassword");
};

// [POST] /user/password/change

module.exports.changePasswordPost = async (req, res) => {
    const newPassword = md5(req.body.newPassword);
    const confirmPassword = md5(req.body.confirmPassword);
    const tokenUser = req.cookies.tokenUser;

    if (newPassword !== confirmPassword) {
        req.flash("error", "Mật khẩu không trùng khớp");
        res.redirect("back");
        return;
    }

    await User.updateOne(
        {
            tokenUser: tokenUser,
            deleted: false,
            status: "active",
        },
        {
            password: newPassword,
        }
    );
    res.redirect("/");
};

// [GET] /user/info
module.exports.userInfo = async (req, res) => {
    // console.log(res.locals.user);
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản",
    });
};
