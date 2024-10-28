module.exports.forgotPassword = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("success", "Yêu cầu nhập email");
        res.redirect("back");
        return;
    }
    next();
};
