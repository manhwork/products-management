const Setting = require("../../models/settingModel");
// [GET] /admin/settings

module.exports.index = async (req, res) => {
    const record = await Setting.findOne({});
    res.render("admin/pages/settings/index", {
        pageTitle: "Cài đặt chung",
        record: record,
    });
};

// [PATCH] /admin/settings

module.exports.settingPatch = async (req, res) => {
    const settingsData = await Setting.findOne({});
    if (!settingsData) {
        const settings = new Setting(req.body);
        await settings.save();
    } else {
        await Setting.updateOne({}, req.body);
    }
    res.redirect("back");
};
