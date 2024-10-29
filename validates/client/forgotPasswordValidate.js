module.exports.forgotPassword = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("success", "Yêu cầu nhập email");
        res.redirect("back");
        return;
    }
    next();
};

module.exports.otpPassword = async (req, res, next) => {
    if (!req.body.otp) {
        req.flash("error", "Yêu cầu nhập OTP");
        res.redirect("back");
        return;
    }
    next();
};

module.exports.changePassword = async (req, res, next) => {
    if (!req.body.newPassword) {
        req.flash("error", "Yêu cầu nhập mật khẩu mới");
        res.redirect("back");
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Yêu cầu nhập xác nhận mật khẩu mới");
        res.redirect("back");
        return;
    }

    next();
};
