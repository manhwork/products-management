const ProductCategory = require("../../models/products-category.model");
const systemConfig = require("../../config/system");
const statusFilterHelper = require("../../helpers/statusFilter");
const searchHelper = require("../../helpers/search");
const phanCap = require("../../helpers/phanCap");
const Account = require("../../models/accounts.model");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };
    // Status fillter
    const statusFilter = statusFilterHelper(req);
    if (req.query.status) {
        find.status = req.query.status;
    }
    // End Status fillter

    // Search
    const objectSearch = searchHelper(req);
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    // End Search

    // Pagination
    const countProducts = await ProductCategory.countDocuments({
        deleted: false,
        status: "active",
    });

    const objectPagiantion = paginationHelper(
        {
            productsLimit: 5,
            currentPage: 1,
        },
        req,
        countProducts);
    console.log(objectPagiantion);
    // End Pagination

    // Phân cấp danh mục

    const records = await ProductCategory
        .find(find)
        .skip(objectPagiantion.productsSkip)
        .limit(objectPagiantion.productsLimit);
    // console.log(records);
    if (records) {
        for (const item of records) {
            if (item.createdBy) {
                const user = await Account.findOne({
                    _id: item.createdBy.account_id,
                });
                if (user) {
                    item.fullName = user.fullName;
                    // console.log(user);
                }
            }
            if (item.updatedBy) {
                const userUpdate = item.updatedBy[item.updatedBy.length - 1];
                item.userUpdate = userUpdate;
                // console.log(item.userUpdate);
                const data = await Account.findOne({
                    _id: item.userUpdate.account_id,
                });
                // console.log(data);
                if (data) {
                    item.fullNameUpdate = data.fullName;
                }
            }
        }
    }
    const newRecords = phanCap(records);
    // console.log(newRecords);
    // End Phân cấp danh mục

    res.render("admin/pages/products-category/index", {
        pageTitle: "Products Category",
        records: newRecords,
        statusFilter: statusFilter,
        objectPagiantion: objectPagiantion
    });
};

// [PATCH] /admin/products-category/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const data = await ProductCategory.findOne({ deleted: false, _id: id });
    const updatedBy = {
        account_id: res.locals.user.id,
    };
    try {
        await ProductCategory.updateOne(
            { _id: id },
            { status: status, $push: { updatedBy: updatedBy } }
        );
        req.flash(
            "success",
            `Thay đổi thành công trạng thái sản phẩm ${data.title}`
        );
    } catch (error) {
        req.flash(
            "success",
            `Thay đổi thất bại trạng thái sản phẩm ${data.title}`
        );
    }
    res.redirect(`back`);
};

// [GET] /admin/products-category/create

module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };

    // Phân cấp danh mục

    const records = await ProductCategory.find(find);
    const newRecords = phanCap(records);

    // End Phân cấp danh mục
    res.render("admin/pages/products-category/create", {
        pageTitle: "Products Category Create",
        records: newRecords,
    });
};

// [POST] /admin/products-category/create

module.exports.createPOST = async (req, res) => {
    if (req.body.position == "") {
        // // Tìm ra vị trí lớn nhất
        // const maxPosition = await ProductCategory.find({
        //     deleted: false,
        // })
        //     .sort({ position: -1 })
        //     .limit(1);
        // req.body.position = parseInt(maxPosition[0].position) + 1;
        const countPosition = await ProductCategory.find({
            deleted: false,
        }).countDocuments();
        req.body.position = parseInt(countPosition + 1);
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const createdBy = {};
    createdBy.account_id = res.locals.user.id;
    // console.log(createdBy);
    req.body.createdBy = createdBy;
    // console.log(req.body);

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", `Tạo sản phẩm thành công !`);

    res.redirect(`${systemConfig.prefixAdmin}/products-category/`);
};

// [PATCH] /admin/products-category/change-multi

module.exports.changeMulti = async (req, res) => {
    // console.log(req.body);
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
        account_id: res.locals.user.id,
    };
    switch (type) {
        case "active":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: "active", $push: { updatedBy: updatedBy } }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái hoạt động thành công ${ids.length} sản phẩm !`
            );
            break;
        case "inactive":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: "inactive", $push: { updatedBy: updatedBy } }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái dừng hoạt động thành công ${ids.length} sản phẩm !`
            );
            break;
        case "delete":
            await ProductCategory.updateMany(
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
                await ProductCategory.updateOne(
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

// [DELETE] /admin/products-category/delete/:id

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await ProductCategory.updateOne(
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
    req.flash("success", `Xoá thành công danh mục !`);
    res.redirect("back");
};

// [GET] /admin/products-category/edit/:id

module.exports.edit = async (req, res) => {
    let find = {
        deleted: false,
    };

    // Phân cấp danh mục

    const records = await ProductCategory.find(find);
    const newRecords = phanCap(records);

    const data = await ProductCategory.findOne({
        deleted: false,
        _id: req.params.id,
    });

    // End Phân cấp danh mục
    res.render("admin/pages/products-category/edit", {
        records: newRecords,
        pageTitle: "Edit page",
        data: data,
    });
};

// [PATCH] /admin/products-category/edit/:id

module.exports.editPatch = async (req, res) => {
    // console.log(res.locals.role);
    const permissions = res.locals.role.permissions;
    // Làm tương tự với các phần khác
    if (permissions.includes("products-category_edit")) {
        if (req.body.position == "") {
            // Tìm ra vị trí lớn nhất
            const maxPosition = await ProductCategory.find({
                deleted: false,
            })
                .sort({ position: -1 })
                .limit(1);
            req.body.position = parseInt(maxPosition[0].position) + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        try {
            const updatedBy = {
                account_id: res.locals.user.id,
            };
            await ProductCategory.updateOne(
                { _id: req.params.id },
                {
                    ...req.body,
                    $push: { updatedBy: updatedBy },
                }
            );
            req.flash("success", "Cập nhật sản phẩm thành công!");
        } catch (error) {
            req.flash("error", "Cập nhật sản phẩm thất bại !");
        }
        res.redirect(`back`);
    } else {
        return;
    }
};

// [GET] /admin/products-category/detail/:id

module.exports.detail = async (req, res) => {
    try {
        find = {
            deleted: false,
        };

        const records = await ProductCategory.find(find);

        const data = await ProductCategory.findOne({
            deleted: false,
            _id: req.params.id,
        });

        if (records.length > 0) {
            for (let item of records) {
                if (req.params.id == item.id) {
                    data.titleParent = item.title;
                    break;
                }
            }
        }

        res.render("admin/pages/products-category/detail", {
            data: data,
            pageTitle: "detail",
        });
    } catch (error) {
        res.redirect("back");
    }
};
