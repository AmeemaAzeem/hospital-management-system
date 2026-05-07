const { sql, poolPromise } = require("../config/db");

// =========================================================
// GET appointments
// =========================================================
const getAppointments = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                a.AppID AS AppointmentID,
                p.Name AS PatientName,
                d.Name AS DoctorName,
                a.AppointmentDate,
                a.AppointmentTime
            FROM Appointments a
            JOIN Patients p ON a.PatientID = p.PatientID
            JOIN Doctors d ON a.DoctorID = d.DoctorID
        `);

        res.json(result.recordset);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

// =========================================================
// ADD appointment
// =========================================================
const addAppointment = async (req, res) => {
    try {
        const { patientID, doctorID, date, time } = req.body;

        if (!patientID || !doctorID || !date || !time) {
            return res.status(400).send("All fields are required");
        }

        const pool = await poolPromise;

        await pool.request()
            .input("patientID", sql.Int, patientID)
            .input("doctorID", sql.Int, doctorID)
            .input("date", sql.Date, date)
            .input("time", sql.Time, time)
            .query(`
                INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, AppointmentTime)
                VALUES (@patientID, @doctorID, @date, @time)
            `);

        res.send("Appointment created successfully");

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAppointments,
    addAppointment
};