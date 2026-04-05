const express = require("express");
const router  = express.Router();
const { auth, roleGuard } = require("../middleware/auth");
const { uploadReceipt }   = require("../config/cloudinary");
const ctrl = require("../controllers/billController");

const canApprove = roleGuard("ADMIN", "MANAGER", "TEAM_LEAD");
const canPay     = roleGuard("ADMIN", "PAYMENT_ADMIN");

router.get  ("/my",           auth,              ctrl.getMyBills);
router.get  ("/stats",        auth,              ctrl.getStats);
router.get  ("/",             auth,              ctrl.getAll);
router.get  ("/:id",          auth,              ctrl.getById);
router.post ("/",             auth, uploadReceipt.single("receipt"), ctrl.create);
router.put  ("/:id",          auth,              ctrl.update);
router.post ("/:id/approve",  auth, canApprove,  ctrl.approve);
router.post ("/:id/reject",   auth, canApprove,  ctrl.reject);
router.post ("/:id/pay",      auth, canPay,       ctrl.pay);

module.exports = router;
