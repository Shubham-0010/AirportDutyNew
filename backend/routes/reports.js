const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getDutyReport, getSubordinateReport } = require('../controllers/reportController');

router.use(protect);

router.get('/duties', getDutyReport);
router.get('/subordinates', adminOnly, getSubordinateReport);

module.exports = router;
