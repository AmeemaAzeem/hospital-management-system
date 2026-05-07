const express = require("express");
const cors = require("cors");
const sql = require("mssql/msnodesqlv8");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   DATABASE CONFIG
========================= */
const dbConfig = {
    server: "localhost",
    database: "HospitalDB",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
};

/* =========================
   CONNECT DB
========================= */
sql.connect(dbConfig)
.then(() => console.log("SQL Server Connected"))
.catch(err => console.log("DB Error:", err));

/* =========================
   PATIENT APIs
========================= */

// Add Patient
app.post("/patients", async (req, res) => {
    try {
        const { name, age, gender } = req.body;

        await sql.query`
            INSERT INTO Patients (Name, Age, Gender)
            VALUES (${name}, ${age}, ${gender})
        `;

        res.json({ message: "Patient added successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get Patients
app.get("/patients", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Patients");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* =========================
   APPOINTMENT APIs
========================= */

// Book appointment
app.post("/appointments", async (req, res) => {
    try {
        const { patientName, doctorName, date } = req.body;

        await sql.query`
            INSERT INTO Appointments (PatientName, DoctorName, Date)
            VALUES (${patientName}, ${doctorName}, ${date})
        `;

        res.json({ message: "Appointment booked" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get appointments
app.get("/appointments", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Appointments");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* =========================
   BILLING APIs (FIXED)
========================= */

// Get patients for billing dropdown
app.get("/billing/patients", async (req, res) => {
    try {
        const result = await sql.query("SELECT PatientID, Name FROM Patients");
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Generate bill
app.post("/billing/generate", async (req, res) => {
    try {
        const { patientID, amount } = req.body;

        await sql.query`
            INSERT INTO Billing (PatientID, Amount)
            VALUES (${patientID}, ${amount})
        `;

        res.json({ message: "Bill generated successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all bills
app.get("/billing/all", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT 
                b.BillID,
                p.Name AS PatientName,
                b.Amount,
                b.BillDate
            FROM Billing b
            JOIN Patients p ON b.PatientID = p.PatientID
            ORDER BY b.BillID DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
    console.log("Server running on port 5000");
});