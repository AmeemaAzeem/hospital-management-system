const express = require("express");
const router = express.Router();

const {
    getPatients,
    addPatient,
    searchPatients
} = require("../controllers/patientController");

// =========================================================
// GET ALL PATIENTS
// Used for:
// - Patient registration table
// - General listing
// =========================================================
router.get("/", getPatients);

// =========================================================
// SEARCH PATIENTS (FOR APPOINTMENT LIVE SEARCH)
// Example: /api/patients/search?name=ali
// =========================================================
router.get("/search", searchPatients);

// =========================================================
// ADD PATIENT
// Used when submitting registration form
// =========================================================
router.post("/", addPatient);

// =========================================================
// (OPTIONAL SAFETY ROUTE)
// Prevents undefined route crashes inside /patients
// =========================================================
router.use((req, res) => {
    res.status(404).json({ message: "Patient route not found" });
});

module.exports = router;