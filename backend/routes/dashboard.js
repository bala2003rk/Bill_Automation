const express = require("express");
const router  = express.Router();
const { auth, roleGuard } = require("../middleware/auth");
const ctrl = require("../controllers/dashboardController");

router.get("/admin"    , auth, roleGuard("ADMIN"),                          ctrl.adminStats);
router.get("/manager"  , auth, roleGuard("ADMIN", "MANAGER"),               ctrl.managerStats);
router.get("/teamlead" , auth, roleGuard("ADMIN", "MANAGER", "TEAM_LEAD"),  ctrl.teamLeadStats);
router.get("/employee" , auth, roleGuard("ADMIN", "MANAGER", "TEAM_LEAD", "EMPLOYEE"), ctrl.employeeStats);
router.get("/payment"  , auth, roleGuard("ADMIN", "PAYMENT_ADMIN"),         ctrl.paymentStats);

module.exports = router;
