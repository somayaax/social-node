const { validate } = require('../../middleware/validation')
const { auth } = require('../../middleware/auth')
const { addAdminValidator, signInValidator, idValidator, updateValidator, getAdminsValidator } = require('./admin.validator')
const { addAdmin, confirmEmail, resendEmail, signIn, getAdminsList, deleteAdmin, editAdminProfile } = require('./controller/admin')
const { endPoint } = require('./endPoint')
const router = require('express').Router()

//signup
router.post('/admin/signup', auth(endPoint.addAdmin), validate(addAdminValidator), addAdmin)
//confirm email
router.get('/admin/confirm/:token', confirmEmail)
//resend confirmation email
router.get('/admin/resend/:token', resendEmail)
//signin
router.post('/admin/signin', validate(signInValidator), signIn)

//get all admins list
router.get('/admin', auth(endPoint.getAdmins),validate(getAdminsValidator), getAdminsList)
//delete admin
router.delete('/admin/:id', auth(endPoint.deleteAdmin), validate(idValidator), deleteAdmin)
//update admin
router.put('/admin/update',auth(endPoint.updateAdmin),validate(updateValidator),editAdminProfile)

module.exports = router