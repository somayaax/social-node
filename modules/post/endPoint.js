const { roles } = require("../../middleware/auth");

exports.endPoint = {
    createPost: [roles.User],
    editPost: [roles.User],
    deletePost: [roles.User, roles.Admin, roles.SuperAdmin],
    getUserPosts: [roles.User, roles.Admin, roles.SuperAdmin],
    getAllPosts: [roles.Admin, roles.SuperAdmin],
    reportPost: [roles.User],
    getReportedPosts: [roles.Admin, roles.SuperAdmin],
    blockPosts: [roles.Admin, roles.SuperAdmin]
}