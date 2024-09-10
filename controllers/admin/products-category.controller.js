const ProductCategory = require("../../models/products-category.model");
const systemConfig = require("../../config/system");
const statusFilterHelper = require("../../helpers/statusFilter");
const searchHelper = require("../../helpers/search");
const phanCap = require("../../helpers/phanCap");

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

    // Phân cấp danh mục

    const records = await ProductCategory.find(find);
    const newRecords = phanCap(records);
    // End Phân cấp danh mục

    res.render("admin/pages/products-category/index", {
        pageTitle: "Products Category",
        records: newRecords,
        statusFilter: statusFilter,
    });
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

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", `Tạo sản phẩm thành công !`);

    res.redirect(`${systemConfig.prefixAdmin}/products-category/`);
};

// [PATCH] /admin/products-category/

module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: "active" }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái hoạt động thành công ${ids.length} sản phẩm !`
            );
            break;
        case "inactive":
            await ProductCategory.updateMany(
                { _id: { $in: ids } },
                { status: "inactive" }
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
                    deletedAt: new Date(),
                }
            );
            req.flash("success", `Xoá thành công ${ids.length} sản phẩm !`);
            break;
        case "change-position":
            ids.forEach(async (element) => {
                const [id, position] = element.split("-");
                await ProductCategory.updateOne(
                    { _id: id },
                    { position: position }
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
            deletedAt: new Date(),
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

// [POST] /admin/products-category/edit/:id

module.exports.editPatch = async (req, res) => {
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
        await ProductCategory.updateOne({ _id: req.params.id }, req.body);

        req.flash("success", "Cập nhật sản phẩm thành công!");
    } catch (error) {
        req.flash("error", "Cập nhật sản phẩm thất bại !");
    }

    res.redirect(`back`);
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
