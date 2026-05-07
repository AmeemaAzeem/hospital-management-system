const sql = require("mssql");

const config = {
    user: "YOUR_USERNAME",
    password: "YOUR_PASSWORD",
    server: "localhost",
    database: "HospitalDB",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

module.exports = sql;
module.exports.config = config;