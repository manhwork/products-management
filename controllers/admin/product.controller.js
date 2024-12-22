const Product = require("../../models/product.model");
const ProductCategory = require("../../models/products-category.model");
const statusFilterHelper = require("../../helpers/statusFilter");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
const phanCap = require("../../helpers/phanCap");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // Status filter
    const find = {
        deleted: false,
    };

    statusFilter = statusFilterHelper(req);

    if (req.query.status) {
        find.status = req.query.status;
    }

    // End Status filter

    // Search
    const objectSearch = searchHelper(req);

    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
    }
    // End search

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagiantion = paginationHelper(
        {
            productsLimit: 5,
            currentPage: 1,
        },
        req,
        countProducts
    );

    // Sort
    const selectSort = {};
    if (req.query.sortKey && req.query.sortValue) {
        selectSort[req.query.sortKey] = req.query.sortValue;
        // Thêm vào object selectSort
    } else {
        selectSort.position = -1;
    }
    // End Sort

    const products = await Product.find(find)
        .sort(selectSort)
        .limit(objectPagiantion.productsLimit)
        .skip(objectPagiantion.productsSkip);
    // End Pagination

    for (const item of products) {
        if (item.createdBy) {
            const user = await Account.findOne({
                _id: item.createdBy.account_id,
            });
            if (user) {
                item.fullName = user.fullName;
            }
        }
        if (item.updatedBy.length > 0) {
            const userUpdate = item.updatedBy[item.updatedBy.length - 1];
            item.userUpdate = userUpdate;
            const data = await Account.findOne({
                _id: item.userUpdate.account_id,
            });
            if (data) {
                item.fullNameUpdate = data.fullName;
            }
        }
    }

    res.render("admin/pages/product/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        statusFilter: statusFilter,
        keyword: objectSearch.keyword,
        objectPagiantion: objectPagiantion,
    });
};

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            account_id: res.locals.user.id,
        };

        await Product.updateOne(
            { _id: id },
            { status: status, $push: { updatedBy: updatedBy } }
        );

        req.flash("success", "Cập nhật thành công !");

        res.redirect("back");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại !");

        res.redirect("back");
    }
};

// [PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
        account_id: res.locals.user.id,
    };

    switch (type) {
        case "active":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "active", $push: { updatedBy: updatedBy } }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái hoạt động thành công ${ids.length} sản phẩm !`
            );
            break;
        case "inactive":
            await Product.updateMany(
                { _id: { $in: ids } },
                { status: "inactive", $push: { updatedBy: updatedBy } }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái dừng hoạt động thành công ${ids.length} sản phẩm !`
            );
            break;
        case "delete":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    deleted: true,
                    // deletedAt: new Date(),
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    },
                }
            );
            req.flash("success", `Xoá thành công ${ids.length} sản phẩm !`);
            break;
        case "change-position":
            ids.forEach(async (element) => {
                const [id, position] = element.split("-");
                await Product.updateOne(
                    { _id: id },
                    { position: position, $push: { updatedBy: updatedBy } }
                );
            });
            req.flash(
                "success",
                `Cập nhật thành công vị trí ${ids.length} sản phẩm !`
            );
            break;
        default:
            break;
    }

    res.redirect("back");
};

// [DELETE] /admin/products/delete/:id

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne(
        { _id: id },
        {
            deleted: true,
            // deletedAt: new Date(),
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            },
        }
    );

    res.redirect("back");
};

// [GET] /admin/products/create

module.exports.create = async (req, res) => {
    const find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);
    const category = phanCap(records);
    res.render("admin/pages/product/create", {
        pageTitle: "Tạo mới sản phẩm",
        category: category,
    });
};

// [POST] /admin/products/create

module.exports.createPOST = async (req, res) => {
    if (req.body) {
        if (req.body.price) {
            req.body.price = parseInt(req.body.price);
        }

        if (req.body.discountPercentage) {
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
        }

        if (req.body.stock) {
            req.body.stock = parseInt(req.body.stock);
        }

        if (req.body.position == "") {
            const maxPosition = await Product.countDocuments({
                deleted: false,
            });
            req.body.position = maxPosition + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        const createdBy = {};
        createdBy.account_id = res.locals.user.id;
        req.body.createdBy = createdBy;

        const product = new Product(req.body);
        await product.save();

        req.flash("success", `Tạo sản phẩm thành công !`);

        res.redirect(`${systemConfig.prefixAdmin}/products/`);
    }
};

// [GET] /admin/products/edit

module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const records = await ProductCategory.find({ deleted: false });
        const category = phanCap(records);
        const product = await Product.findOne(find);

        res.render("admin/pages/product/edit", {
            product: product,
            category: category,
            pageTitle: "Chỉnh sửa sản phẩm",
        });
    } catch (error) {
        req.flash("error", "Vui lòng chọn lại sản phẩm cần sửa !");

        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/products/edit

module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);

    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const maxPosition = await Product.countDocuments({ deleted: false });
        req.body.position = maxPosition + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
        };
        await Product.updateOne(
            { _id: req.params.id },
            { ...req.body, $push: { updatedBy: updatedBy } }
        );

        req.flash("success", "Cập nhật sản phẩm thành công!");
    } catch (error) {
        req.flash("error", "Cập nhật sản phẩm thất bại !");
    }

    res.redirect(`back`);
};

// [GET] /admin/products/detail

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const product = await Product.findOne(find);
        const records = await ProductCategory.find({ deleted: false });
        for (var item of records) {
            if (item.id === product.product_category_id) {
                product.parentTitle = item.title;
                break;
            }
        }
        res.render("admin/pages/product/detail", {
            product: product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
