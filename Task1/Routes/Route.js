const express =  require('express')
const router = express.Router()
const userController = require('../Controllers/userController')

router.post('/api/register',userController.userRegistration)
router.post('/api/login',userController.userLogin)
router.post('/api/sendOtp',userController.sendOTPtoEmail)

module.exports = router