const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");
// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Nhóm quyền",
        records: records,
    });
};

// [GET] /admin/roles/create

module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền",
    });
};
// [POST] /admin/roles/create

module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id

module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
        };

        const records = await Role.find(find);

        const data = await Role.findOne({
            _id: req.params.id,
            deleted: false,
        });

        res.render("admin/pages/roles/edit.pug", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/admin/roles`);
    }
};

// [PATCH] /admin/roles/edit/:id

module.exports.editPatch = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Cập nhật nhóm quyền thành công !");
    } catch (error) {
        req.flash("error", "Cập nhật sản phẩm thất bại !");
    }
    res.redirect(`back`);
};
