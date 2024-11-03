const Setting = require("../../models/settingModel");
module.exports.infoWebsite = async (req, res, next) => {
    const settings = await Setting.findOne({});
    if (settings) {
        res.locals.infoWeb = settings;
    }
    next();
};
