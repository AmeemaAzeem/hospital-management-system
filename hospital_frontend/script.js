document.addEventListener("DOMContentLoaded", () => {

    console.log("🔥 script.js LOADED");

    let selectedPatientID = null;
    const BASE_URL = "http://localhost:3000";

    // =========================================================
    // PATIENT REGISTRATION
    // =========================================================
    document.getElementById("patientForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name")?.value;
        const age = document.getElementById("age")?.value;
        const gender = document.getElementById("gender")?.value;
        const message = document.getElementById("message");

        try {
            const res = await fetch(`${BASE_URL}/patients`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, age, gender })
            });

            if (!res.ok) throw new Error("Patient registration failed");

            message.style.display = "block";
            message.style.background = "#d4edda";
            message.style.color = "#155724";
            message.textContent = "✅ Patient registered successfully!";

            document.getElementById("patientForm").reset();
            setTimeout(() => message.style.display = "none", 3000);

            loadPatients();

        } catch (err) {
            console.log("❌ Patient error:", err);
        }
    });

    // =========================================================
    // LOAD PATIENTS
    // =========================================================
    async function loadPatients() {
        try {
            const tableBody = document.querySelector("#patientsTable tbody");
            if (!tableBody) return;

            const res = await fetch(`${BASE_URL}/patients`);
            const data = await res.json();

            tableBody.innerHTML = "";

            data.forEach(p => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${p.PatientID}</td>
                        <td>${p.Name}</td>
                        <td>${p.Age}</td>
                        <td>${p.Gender}</td>
                    </tr>
                `;
            });

        } catch (err) {
            console.log("❌ Load patients error:", err);
        }
    }

    // =========================================================
    // LOAD DOCTORS
    // =========================================================
    async function loadDoctors() {
        try {
            const res = await fetch(`${BASE_URL}/doctors`);
            const doctors = await res.json();

            // =================================================
            // APPOINTMENT PAGE DROPDOWN
            // =================================================
            const select = document.getElementById("doctorSelect");

            if (select) {
                select.innerHTML = `<option value="">Select Doctor</option>`;

                doctors.forEach(doc => {
                    const option = document.createElement("option");

                    option.value = doc.DoctorID;

                    const dept = doc.DeptName || "Department";

                    option.textContent = `${doc.Name} - ${dept}`;

                    select.appendChild(option);
                });
            }

            // =================================================
            // DOCTOR PAGE LIST
            // =================================================
            const doctorList = document.getElementById("doctorList");

            if (doctorList) {

                doctorList.innerHTML = "";

                doctors.forEach(doc => {

                    const dept = doc.DeptName || "Department";

                    doctorList.innerHTML += `
                        <li>
                            Dr. ${doc.Name} - ${dept}
                        </li>
                    `;
                });
            }

        } catch (err) {
            console.log("❌ Doctor load error:", err);
        }
    }

    // =========================================================
    // PATIENT SEARCH
    // =========================================================
    const patientInput = document.getElementById("patientSearch");
    const patientResults = document.getElementById("patientResults");

    if (patientInput) {

        patientInput.addEventListener("input", async (e) => {

            const value = e.target.value.trim();

            if (!value) {
                patientResults.innerHTML = "";
                return;
            }

            try {

                const res = await fetch(`${BASE_URL}/patients/search?name=${value}`);
                const patients = await res.json();

                patientResults.innerHTML = "";

                patients.forEach(p => {

                    const div = document.createElement("div");

                    div.textContent = p.Name;

                    div.onclick = () => {
                        patientInput.value = p.Name;
                        selectedPatientID = p.PatientID;
                        patientResults.innerHTML = "";
                    };

                    patientResults.appendChild(div);
                });

            } catch (err) {
                console.log("❌ Patient search error:", err);
            }
        });
    }

    // =========================================================
    // LOAD APPOINTMENTS
    // =========================================================
    async function loadAppointments() {

        const table = document.querySelector("#appointmentsTable tbody");

        if (!table) return;

        try {

            const res = await fetch(`${BASE_URL}/appointments`);
            const data = await res.json();

            table.innerHTML = "";

            data.forEach(app => {

                const date = app.Date || app.AppointmentDate || "";
                const time = app.Time || app.AppointmentTime || "";

                table.innerHTML += `
                    <tr>
                        <td>${app.PatientName}</td>
                        <td>${app.DoctorName}</td>
                        <td>${date}</td>
                        <td>${time}</td>
                    </tr>
                `;
            });

        } catch (err) {
            console.log("❌ Appointment load error:", err);
        }
    }

    // =========================================================
    // BOOK APPOINTMENT
    // =========================================================
    const appointmentForm = document.getElementById("appointmentForm");
    const messageBox = document.getElementById("messageBox");

    appointmentForm?.addEventListener("submit", async (e) => {

        e.preventDefault();

        const doctorID = document.getElementById("doctorSelect")?.value;
        const date = document.getElementById("date")?.value;
        const time = document.getElementById("time")?.value;

        if (!selectedPatientID || !doctorID || !date || !time) {

            messageBox.innerText = "⚠ Please fill all fields";
            messageBox.style.color = "red";

            return;
        }

        try {

            const res = await fetch(`${BASE_URL}/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientID: selectedPatientID,
                    doctorID,
                    date,
                    time
                })
            });

            const msg = await res.text();

            messageBox.innerText = "✅ " + msg;
            messageBox.style.color = "lightgreen";

            appointmentForm.reset();

            if (patientInput) {
                patientInput.value = "";
            }

            selectedPatientID = null;

            loadAppointments();

        } catch (err) {
            console.log("❌ Appointment error:", err);
        }
    });

    // =========================================================
    // BILLING SYSTEM
    // =========================================================
    const billingForm = document.getElementById("billingForm");
    const patientSelect = document.getElementById("patientSelect");
    const billMessage = document.getElementById("billMessage");
    const billTableBody = document.querySelector("#billTable tbody");

    async function loadPatientsForBilling() {

        try {

            const res = await fetch(`${BASE_URL}/billing/patients`);
            const data = await res.json();

            if (!patientSelect) return;

            patientSelect.innerHTML = `<option value="">Select Patient</option>`;

            data.forEach(p => {

                const option = document.createElement("option");

                option.value = p.PatientID;
                option.textContent = p.Name;

                patientSelect.appendChild(option);
            });

        } catch (err) {
            console.log("❌ Billing patients error:", err);
        }
    }

    async function loadBills() {

        try {

            const res = await fetch(`${BASE_URL}/billing/all`);
            const data = await res.json();

            if (!billTableBody) return;

            billTableBody.innerHTML = "";

            data.forEach(b => {

                billTableBody.innerHTML += `
                    <tr>
                        <td>${b.PatientName}</td>
                        <td>${b.Amount}</td>
                        <td>${b.BillDate}</td>
                    </tr>
                `;
            });

        } catch (err) {
            console.log("❌ Billing load error:", err);
        }
    }

    billingForm?.addEventListener("submit", async (e) => {

        e.preventDefault();

        const patientID = patientSelect.value;
        const amount = document.getElementById("amount").value;

        try {

            const res = await fetch(`${BASE_URL}/billing/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientID, amount })
            });

            const msg = await res.text();

            billMessage.innerText = "✅ " + msg;
            billMessage.style.color = "green";

            billingForm.reset();

            loadBills();

        } catch (err) {
            console.log("❌ Billing error:", err);
        }
    });

    // =========================================================
    // INITIAL LOAD
    // =========================================================
    loadDoctors();
    loadAppointments();
    loadPatients();
    loadPatientsForBilling();
    loadBills();

});