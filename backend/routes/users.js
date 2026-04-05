const express = require("express");
const router  = express.Router();
const { auth, roleGuard } = require("../middleware/auth");
const ctrl = require("../controllers/userController");

const adminOnly = roleGuard("ADMIN");

router.get   ("/",            auth,             ctrl.getAll);
router.get   ("/:id",         auth,             ctrl.getById);
router.post  ("/",            auth, adminOnly,  ctrl.create);
router.put   ("/:id",         auth,             ctrl.update);
router.delete("/:id",         auth, adminOnly,  ctrl.remove);
router.patch ("/:id/toggle",  auth, adminOnly,  ctrl.toggleStatus);

module.exports = router;
