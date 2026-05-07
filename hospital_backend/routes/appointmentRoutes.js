const express = require("express");
const router = express.Router();

const { sql, poolPromise } = require("../config/db");


// =========================================================
// BOOK APPOINTMENT
// =========================================================
router.post("/", async (req, res) => {

    try {
        const { patientID, doctorID, date, time } = req.body;

        console.log("BOOKING DATA:", req.body);

        // =========================
        // VALIDATION
        // =========================
        if (!patientID || !doctorID || !date || !time) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const pool = await poolPromise;

        // =========================
        // ✅ CORRECT TIME CONVERSION (FIXED)
        // =========================
        // incoming: "08:30"
        const [hours, minutes] = time.split(":");

        const fixedTime = new Date();
        fixedTime.setHours(parseInt(hours));
        fixedTime.setMinutes(parseInt(minutes));
        fixedTime.setSeconds(0);
        fixedTime.setMilliseconds(0);

        console.log("RAW TIME:", time);
        console.log("FIXED TIME:", fixedTime);

        // =========================
        // CALL STORED PROCEDURE
        // =========================
        const result = await pool.request()
            .input("PatientID", sql.Int, patientID)
            .input("DoctorID", sql.Int, doctorID)
            .input("Date", sql.Date, date)
            .input("Time", sql.Time, fixedTime)   // ✅ NOW VALID
            .execute("BookAppointments");

        const message = result.recordset?.[0]?.Message || "Appointment booked successfully";

        return res.json({ message });

    } catch (err) {
        console.log("❌ BOOK ERROR FULL:", err);

        return res.status(500).json({
            message: err.message
        });
    }
});


// =========================================================
// GET ALL APPOINTMENTS
// =========================================================
router.get("/", async (req, res) => {

    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                P.Name AS PatientName,
                D.Name AS DoctorName,
                CONVERT(VARCHAR, A.AppointmentDate, 23) AS AppointmentDate,
                CONVERT(VARCHAR, A.AppointmentTime, 8) AS AppointmentTime
            FROM Appointments A
            JOIN Patients P ON A.PatientID = P.PatientID
            JOIN Doctors D ON A.DoctorID = D.DoctorID
            ORDER BY A.AppointmentDate, A.AppointmentTime
        `);

        res.json(result.recordset);

    } catch (err) {
        console.log("❌ FETCH ERROR:", err);
        res.status(500).json({ message: "Error fetching appointments" });
    }
});


// =========================================================
// DOCTOR SLOTS
// =========================================================
router.get("/doctor-slots", async (req, res) => {

    const { doctorID, date } = req.query;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input("DoctorID", sql.Int, doctorID)
            .input("Date", sql.Date, date)
            .query(`
                SELECT CONVERT(VARCHAR, AppointmentTime, 8) AS Time
                FROM Appointments
                WHERE DoctorID = @DoctorID AND AppointmentDate = @Date
            `);

        res.json(result.recordset);

    } catch (err) {
        console.log("❌ SLOT ERROR:", err);
        res.status(500).json({ message: "Error fetching slots" });
    }
});

module.exports = router;