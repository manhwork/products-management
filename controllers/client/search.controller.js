const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET] /search?keyword=

module.exports.index = async (req, res) => {
    try {
        if(req.query.keyword){
            const keyword = new RegExp(req.query.keyword,"gi");
            // console.log(keyword);
            let newProducts = [];
            const products = await Product.find({
                deleted: false,
                title: keyword,
                status: "active"
            })
            newProducts = productsHelper.newPrice(products);
            res.render("client/pages/search/index.pug",{
                pageTitle : "Kết quả tìm kiếm",
                keyword : req.query.keyword,
                products : newProducts,
            });
        } else {
            res.redirect(`/products`)
        }
    
    } catch (error) {
        res.send("404");
    }

};