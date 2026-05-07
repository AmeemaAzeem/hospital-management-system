const { sql, poolPromise } = require("../config/db");

// =========================================================
// GET ALL DOCTORS
// =========================================================
const getDoctors = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                d.DoctorID,
                d.Name,
                dep.DeptName
            FROM Doctors d
            JOIN Departments dep
            ON d.DeptID = dep.DeptID
        `);

        res.json(result.recordset);

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

// =========================================================
// ADD DOCTOR
// =========================================================
const addDoctor = async (req, res) => {
    try {
        const { name, deptID } = req.body;

        const pool = await poolPromise;

        await pool.request()
            .input("name", sql.VarChar, name)
            .input("deptID", sql.Int, deptID)
            .query(`
                INSERT INTO Doctors (Name, DeptID)
                VALUES (@name, @deptID)
            `);

        res.send("Doctor added successfully");

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};

// IMPORTANT EXPORT
module.exports = {
    getDoctors,
    addDoctor
};