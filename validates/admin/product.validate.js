module.exports.createPost = (req, res, next) => {
    if (req.body.title === "") {
        req.flash("error", `Vui lòng nhập thông tin sản phẩm`);
        res.redirect("back");
        return;
    }

    // if(req.body.title.length > 8) {
    //     req.flash("error", `Vui lòng nhập tiêu đề không quá 8 kí tự !`);
    //     res.redirect("back");
    //     return;
    // }

    next();
}