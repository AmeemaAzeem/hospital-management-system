const sql = require("mssql");

const config = {
    user: "hospital_user",
    password: "12345",
    server: "localhost",
    database: "HospitalDB",

    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Create single shared pool
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("✅ Connected to SQL Server successfully");
        return pool;
    })
    .catch(err => {
        console.log("❌ DB Connection Failed:", err.message);
    });

module.exports = {
    sql,
    poolPromise
};