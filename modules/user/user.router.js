const router = require('express').Router()
const { auth } = require('../../middleware/auth')
const { validate } = require('../../middleware/validation')
const { forgetPassword, resetPassword } = require('./controller/forgetPassword')
const { signUp, confirmEmail, resendEmail, signIn } = require('./controller/register')
const { updateProfile, updatePassword, deactivate, blockUser } = require('./controller/update')
const { endPoint } = require('./endpoint')
const { signUpValidator, signInValidator, updateProfileValidator, updatePasswordValidator, forgetPasswordValidator, resetPasswordValidator, blockValidator, deactivateValidator } = require('./user.validator')

//sign up
router.post('/user/signup', validate(signUpValidator), signUp)
//confirm email
router.get('/confirm/:token', confirmEmail)
//resend confirmation email
router.get('/resend/:token', resendEmail)
//sign in
router.post('/user/signin', validate(signInValidator), signIn)

//update profile
router.put('/user/update/profile', auth(endPoint.updateProfile), validate(updateProfileValidator), updateProfile)
//update password
router.patch('/user/update/password', auth(endPoint.updatePassword), validate(updatePasswordValidator), updatePassword)

//forget password
router.post('/user/forget/password', validate(forgetPasswordValidator), forgetPassword)
//reset password
router.patch('/user/resetPassword/:token', validate(resetPasswordValidator), resetPassword)

//block user BY ADMIN OR SUPER ADMIN ........................................................
router.patch('/user/block/:id', auth(endPoint.blockUser), validate(blockValidator), blockUser)
//deactivate account
router.patch('/user/deactivate', auth(endPoint.deactivateAcc), validate(deactivateValidator), deactivate)

module.exports = router