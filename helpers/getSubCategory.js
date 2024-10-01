const ProductsCategory = require("../models/products-category.model");

module.exports.getSubCate = async (parentId) => {
    const getSubCategory = async (parentId) => {
        const subs = await ProductsCategory.find({
            deleted: false,
            status: "active",
            parent_id: parentId,
        });
        let allSubs = [...subs];

        for (const sub of subs) {
            const childs = await getSubCategory(sub.id);
            allSubs = [...allSubs, ...childs];
        }

        return allSubs;
    };
    const result = await getSubCategory(parentId);
    return result;
};
