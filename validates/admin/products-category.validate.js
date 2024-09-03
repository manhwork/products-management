module.exports.createPost = (req, res, next) => {
  if (req.body.title === "") {
    req.flash("error", `Vui lòng nhập thông tin sản phẩm`);
    res.redirect("back");
    return;
  }

  next();
};
