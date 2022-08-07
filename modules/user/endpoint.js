const {roles} = require('../../middleware/auth')

exports.endPoint = {
    updateProfile:[roles.User],
    updatePassword:[roles.User],
    blockUser:[roles.Admin,roles.SuperAdmin],
    deactivateAcc :[roles.User]
}