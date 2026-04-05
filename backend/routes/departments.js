const express = require("express");
const router  = express.Router();
const { auth, roleGuard } = require("../middleware/auth");
const ctrl = require("../controllers/departmentController");

const adminOnly = roleGuard("ADMIN");

router.get ("/"    , auth,            ctrl.getAll);
router.post("/"    , auth, adminOnly, ctrl.create);
router.put ("/:id" , auth, adminOnly, ctrl.update);

module.exports = router;
