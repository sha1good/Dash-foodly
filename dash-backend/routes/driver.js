const router = require('express').Router();
const driverController = require('../controllers/driverController')
const { verifyAndAuthorization, verifyDriver } = require('../middlewares/verifyToken')


router.post('/',verifyAndAuthorization ,driverController.registerDriver)

router.patch('/', verifyDriver ,driverController.setDriverAvailability)



module.exports = router;