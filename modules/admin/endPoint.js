const { roles } = require("../../middleware/auth");
exports.endPoint = {
    addAdmin:[roles.SuperAdmin],
    getAdmins:[roles.SuperAdmin],
    deleteAdmin:[roles.SuperAdmin],
    updateAdmin:[roles.Admin]
}