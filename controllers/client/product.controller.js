const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
const ProductsCategory = require("../../models/products-category.model");
const getSubCateHelper = require("../../helpers/getSubCategory");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false,
    }).sort({ position: -1 });

    const newProducts = productsHelper.newPrice(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sach san pham",
        products: newProducts,
    });
};

// [GET] /products/:slug

module.exports.detail = async (req, res) => {
    console.log(req.params.slug);

    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
        };

        const product = await Product.findOne(find);

        res.render("client/pages/products/detail", {
            pageTitle: req.params.slug,
            product: product,
            status: "active",
        });
    } catch (error) {
        res.redirect(`/products`);
    }
};

// [GET] /products/:slugCategory

module.exports.category = async (req, res) => {
    try {
        // console.log(req.params.slugCategory);

        const Category = await ProductsCategory.findOne({
            deleted: false,
            slug: req.params.slugCategory,
            status: "active",
        });

        // console.log(await getSubCategory(Category.id));
        const listSubCategory = await getSubCateHelper.getSubCate(Category.id);
        // console.log(listSubCategory);
        const getSubCategoryId = listSubCategory.map((item) => item.id);
        // console.log(getSubCategoryId);

        const products = await Product.find({
            deleted: false,
            status: "active",
            product_category_id: {
                $in: [Category.id, ...getSubCategoryId],
            },
        }).sort({ position: "desc" });

        // console.log(products);
        const newProducts = productsHelper.newPrice(products);

        res.render("client/pages/products/index", {
            products: newProducts,
            pageTitle: Category.title,
        });
    } catch (error) {
        req.flash("error", `Truy cập thất bại !`);
        res.redirect("back");
    }
};
