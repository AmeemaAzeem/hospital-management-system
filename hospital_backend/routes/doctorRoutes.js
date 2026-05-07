const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctorController");

// =========================
// GET ALL DOCTORS (FOR DROPDOWN + LIST)
// =========================
router.get("/", controller.getDoctors);

// =========================
// ADD NEW DOCTOR
// =========================
router.post("/", controller.addDoctor);
console.log("DOCTOR ROUTES LOADED");
module.exports = router;