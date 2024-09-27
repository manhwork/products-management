const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");
const Account = require("../../models/accounts.model");
// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    const records = await Role.find(find);

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
        if (item.updatedBy.length > 0) {
            const userUpdate = item.updatedBy[item.updatedBy.length - 1];
            item.userUpdate = userUpdate;
            const data = await Account.findOne({ _id: userUpdate.account_id });
            item.fullNameUpdate = data.fullName;
        }
    }

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
    const createdBy = {};
    createdBy.account_id = res.locals.user.id;
    // console.log(createdBy);
    req.body.createdBy = createdBy;
    // console.log(req.body);
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

        // const records = await Role.find(find);

        const data = await Role.findOne({
            _id: req.params.id,
            deleted: false,
        });

        // console.log(data);

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
        const updatedBy = {
            account_id: res.locals.user.id,
        };

        // console.log(req.body);
        await Role.updateOne(
            { _id: req.params.id },
            {
                ...req.body,
                $push: { updatedBy: updatedBy },
            }
        );
        req.flash("success", "Cập nhật nhóm quyền thành công !");
    } catch (error) {
        req.flash("error", "Cập nhật sản phẩm thất bại !");
    }
    res.redirect(`back`);
};

// [GET] /admin/roles/detail/:id

module.exports.detail = async (req, res) => {
    const data = await Role.findOne({
        deleted: false,
        _id: req.params.id,
    });

    res.render("admin/pages/roles/detail.pug", {
        pageTitle: "Chi tiết phân quyền",
        data: data,
    });
};

// [DELETE] /admin/roles/delete/:id

module.exports.delete = async (req, res) => {
    try {
        const data = await Role.findOne({
            deleted: false,
            _id: req.params.id,
        });
        await Role.updateOne(
            { _id: req.params.id },
            {
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                },
                deleted: true,
            }
        );
        req.flash("success", `Xoá thành nhóm quyền ${data.title} !`);
    } catch (error) {
        req.flash("error", `Xoá thất bại sản phẩm ${data.title} !`);
    }
    res.redirect(`back`);
};

// [GET] /admin/roles/permission

module.exports.permission = async (req, res) => {
    const find = {
        deleted: false,
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/permission.pug", {
        pageTitle: "Phân quyền",
        records: records,
    });
};

// [PATCH] /admin/roles/permission

module.exports.permissionPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            await Role.updateOne(
                { _id: item.id },
                {
                    permissions: item.permissions,
                }
            );
        }
        req.flash("success", `Cập nhật phân quyền thành công !`);
    } catch (error) {
        req.flash("error", `Cập nhật phân qyền thất bại !`);
    }
    res.redirect("back");
};
