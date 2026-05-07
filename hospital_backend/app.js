const express = require("express");
const cors = require("cors");

const app = express();

// =========================================================
// MIDDLEWARE
// =========================================================
app.use(cors());
app.use(express.json());

// =========================================================
// ROUTES
// =========================================================
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const billingRoutes = require("./routes/billingRoutes");

// IMPORTANT: match frontend URLs
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/billing", billingRoutes);

// =========================================================
// DEFAULT ROUTE
// =========================================================
app.get("/", (req, res) => {
    res.send("Hospital Management System API is running...");
});

// =========================================================
// 404 HANDLER
// =========================================================
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// =========================================================
// START SERVER
// =========================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});