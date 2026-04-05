const express = require("express");
const router  = express.Router();
const { auth, roleGuard } = require("../middleware/auth");
const ctrl = require("../controllers/projectController");

const canManage = roleGuard("ADMIN", "MANAGER");

router.get ("/"           , auth,            ctrl.getAll);
router.get ("/:id"        , auth,            ctrl.getById);
router.post("/"           , auth, canManage, ctrl.create);
router.put ("/:id"        , auth, canManage, ctrl.update);
router.post("/:id/members", auth, canManage, ctrl.assignMember);

module.exports = router;
