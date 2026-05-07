const { sql, poolPromise } = require("../config/db");

// =========================================================
// GET PATIENTS (FOR DROPDOWN)
// =========================================================
exports.getPatients = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(
            "SELECT PatientID, Name FROM Patients"
        );

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching patients");
    }
};


// =========================================================
// GENERATE BILL
// =========================================================
exports.generateBill = async (req, res) => {
    try {
        const { patientID, amount } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input("patientID", sql.Int, patientID)
            .input("amount", sql.Decimal(10,2), amount)
            .query(`
                INSERT INTO Billing (PatientID, Amount)
                VALUES (@patientID, @amount)
            `);

        res.send("Bill generated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating bill");
    }
};


// =========================================================
// GET ALL BILLS (TABLE)
// =========================================================
exports.getAllBills = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
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
        console.error(err);
        res.status(500).send("Error fetching bills");
    }
};