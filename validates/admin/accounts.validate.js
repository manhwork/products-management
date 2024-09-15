module.exports.createPost = (req, res, next) => {
    if (req.body.fullName === "") {
        req.flash("error", `Vui lòng nhập tên người dùng`);
        res.redirect("back");
        return;
    }
    if (req.body.email === "") {
        req.flash("error", `Vui lòng nhập email`);
        res.redirect("back");
        return;
    }

    next();
};
