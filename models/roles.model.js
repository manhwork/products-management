const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: [],
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
