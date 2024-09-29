const ProductCategory = require("../../models/products-category.model");
const phanCapHelper = require("../../helpers/phanCap");
// [GET] /
module.exports.index = async (req, res) => {
    find = {
        deleted: false,
    };
    const records = await ProductCategory.find(find);
    const newRecords = phanCapHelper(records);
    // console.log(newRecords);
    res.render("client/pages/home/index", {
        pageTitle: "Trang chu",
        records: newRecords,
    });
};
