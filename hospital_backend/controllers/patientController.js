const { sql, poolPromise } = require("../config/db");


// =========================================================
// GET ALL PATIENTS
// =========================================================
const getPatients = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .query(`
                SELECT 
                    PatientID,
                    Name,
                    Age,
                    Gender
                FROM Patients
                ORDER BY PatientID DESC
            `);

        res.json(result.recordset);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching patients: " + err.message);
    }
};


// =========================================================
// ADD PATIENT
// =========================================================
const addPatient = async (req, res) => {
    try {
        const { name, age, gender } = req.body;

        if (!name || !age || !gender) {
            return res.status(400).send("All fields are required");
        }

        const pool = await poolPromise;

        await pool.request()
            .input("name", sql.VarChar(100), name)
            .input("age", sql.Int, age)
            .input("gender", sql.VarChar(10), gender)
            .query(`
                INSERT INTO Patients (Name, Age, Gender)
                VALUES (@name, @age, @gender)
            `);

        res.send("Patient added successfully");

    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding patient: " + err.message);
    }
};


// =========================================================
// SEARCH PATIENTS
// =========================================================
const searchPatients = async (req, res) => {
    try {
        const pool = await poolPromise;

        const name = req.query.name || "";

        const result = await pool.request()
            .input("name", sql.VarChar, `%${name}%`)
            .query(`
                SELECT PatientID, Name
                FROM Patients
                WHERE Name LIKE @name
            `);

        res.json(result.recordset);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error searching patients: " + err.message);
    }
};


// =========================================================
// EXPORT
// =========================================================
module.exports = {
    getPatients,
    addPatient,
    searchPatients
};