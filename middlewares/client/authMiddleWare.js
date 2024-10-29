module.exports.authMiddleware = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        res.redirect("/user/login");
        return;
    }
    next();
};
