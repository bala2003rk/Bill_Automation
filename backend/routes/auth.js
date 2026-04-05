const express = require("express");
const router  = express.Router();
const { auth } = require("../middleware/auth");
const { uploadQr } = require("../config/cloudinary");
const ctrl = require("../controllers/authController");

router.post("/login",           ctrl.login);
router.get ("/me",      auth,   ctrl.getMe);
router.put ("/me",      auth,   ctrl.updateMe);
router.put ("/me/password", auth, ctrl.changePassword);
router.post("/me/qr-upload", auth, uploadQr.single("file"), ctrl.uploadQr);

module.exports = router;
