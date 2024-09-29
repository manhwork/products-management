const ProductCategory = require("../../models/products-category.model");
const phanCapHelper = require("../../helpers/phanCap");

module.exports.categoryMiddleWare = async (req, res, next) => {
    find = {
        deleted: false,
    };
    const records = await ProductCategory.find(find);
    const layoutCategory = phanCapHelper(records);
    res.locals.layoutCategory = layoutCategory;
    next();
};
