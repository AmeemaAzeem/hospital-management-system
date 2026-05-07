/* =========================================================
   HOSPITAL MANAGEMENT SYSTEM (ADBMS PROJECT)
   This script covers:
   - Tables (3NF design)
   - Sample data
   - Joins
   - Stored Procedures
   - Error Handling
   - Transactions (ACID)
   - Concurrency Control
   - Trigger
   ========================================================= */

------------------------------------------------------------
-- 1. CREATE DATABASE
------------------------------------------------------------
CREATE DATABASE

IF DB_ID('HospitalDB') IS NOT NULL
DROP DATABASE HospitalDB;
GO

CREATE DATABASE HospitalDB;
GO

--CREATE LOGIN hospital_user 
--WITH PASSWORD = 'Hospital@123';

USE HospitalDB;

--CREATE USER hospital_user FOR LOGIN hospital_user;

--ALTER ROLE db_owner ADD MEMBER hospital_user;
ALTER LOGIN hospital_user WITH PASSWORD = '12345';

USE HospitalDB;
GO
------------------------------------------------------------
-- 2. CREATE TABLES (Normalized Structure - 3NF)
------------------------------------------------------------

-- Department table (separate to avoid repeating department names)
CREATE TABLE Departments (
    DeptID INT PRIMARY KEY IDENTITY(1,1),
    DeptName VARCHAR(50) NOT NULL
);

-- Doctors linked with Departments
CREATE TABLE Doctors (
    DoctorID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(50),
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID)
);

-- Patients table (basic details)
CREATE TABLE Patients (
    PatientID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(50),
    Age INT,
    Gender VARCHAR(10)
);

-- Appointments table (connects patient and doctor)
CREATE TABLE Appointments (
    AppID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT,
    DoctorID INT,
    AppointmentDate DATE,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors(DoctorID)
);

-- Billing table (separate for normalization)
CREATE TABLE Billing (
    BillID INT PRIMARY KEY IDENTITY(1,1),
    PatientID INT,
    Amount DECIMAL(10,2),
    BillDate DATE DEFAULT GETDATE(),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
);

-- Staff table (extra entity for better design)
CREATE TABLE Staff (
    StaffID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(50),
    Role VARCHAR(50)
);

------------------------------------------------------------
-- 3. INSERT SAMPLE DATA (for testing/demo)
------------------------------------------------------------

INSERT INTO Departments (DeptName) VALUES 
('Cardiology'), ('Neurology'), ('Orthopedics');
INSERT INTO Departments (DeptName) VALUES
('Pediatrics'),
('Oncology'),
('Dermatology'),
('ENT'),
('Radiology'),
('Psychiatry'),
('Urology');

INSERT INTO Doctors (Name, DeptID) VALUES 
('Dr Ali', 1),
('Dr Sara', 2),
('Dr Ahmed', 3);
INSERT INTO Doctors (Name, DeptID) VALUES
 ('Dr Khan',4),
('Dr Zain',5), ('Dr Fatima',6), ('Dr Usman',7), ('Dr Noor',8),
('Dr Hamza',9), ('Dr Areeba',10),

('Dr Bilal',1), ('Dr Hina',2), ('Dr Yasir',3), ('Dr Sana',4),
('Dr Imran',5), ('Dr Komal',6), ('Dr Waqas',7), ('Dr Mahnoor',8),
('Dr Saad',9), ('Dr Iqra',10),

('Dr Hassan',1), ('Dr Anum',2), ('Dr Faisal',3), ('Dr Rabia',4),
('Dr Danish',5), ('Dr Mehwish',6), ('Dr Omer',7), ('Dr Laiba',8),
('Dr Adnan',9), ('Dr Nida',10),

('Dr Talha',1), ('Dr Ayesha',2), ('Dr Fahad',3), ('Dr Bushra',4),
('Dr Rizwan',5), ('Dr Alina',6), ('Dr Junaid',7), ('Dr Kiran',8),
('Dr Salman',9), ('Dr Hira',10);
SELECT * FROM Doctors

INSERT INTO Patients (Name, Age, Gender) VALUES 
('Ayesha', 22, 'Female'),
('Bilal', 30, 'Male');
INSERT INTO Patients (Name, Age, Gender) VALUES
('Ayesha',22,'Female'), ('Bilal',30,'Male'),
('Ali',25,'Male'), ('Sara',28,'Female'),
('Ahmed',35,'Male'), ('Fatima',21,'Female'),
('Usman',40,'Male'), ('Noor',19,'Female'),
('Hamza',32,'Male'), ('Areeba',26,'Female'),

('Zain',27,'Male'), ('Hina',24,'Female'),
('Yasir',33,'Male'), ('Sana',29,'Female'),
('Imran',45,'Male'), ('Komal',23,'Female'),
('Waqas',36,'Male'), ('Mahnoor',20,'Female'),
('Saad',31,'Male'), ('Iqra',22,'Female'),

('Hassan',38,'Male'), ('Anum',27,'Female'),
('Faisal',34,'Male'), ('Rabia',25,'Female'),
('Danish',41,'Male'), ('Mehwish',30,'Female'),
('Omer',28,'Male'), ('Laiba',19,'Female'),
('Adnan',37,'Male'), ('Nida',21,'Female'),

('Talha',33,'Male'), ('Ayesha Noor',26,'Female'),
('Fahad',29,'Male'), ('Bushra',24,'Female'),
('Rizwan',42,'Male'), ('Alina',23,'Female'),
('Junaid',35,'Male'), ('Kiran',20,'Female'),
('Salman',31,'Male'), ('Hira',22,'Female');
SELECT * FROM Patients
INSERT INTO Staff (Name, Role) VALUES 
('Receptionist 1', 'Reception'),
('Nurse 1', 'Nurse');
INSERT INTO Staff (Name, Role) VALUES
('Staff1','Reception'), ('Staff2','Nurse'),
('Staff3','Reception'), ('Staff4','Nurse'),
('Staff5','Reception'), ('Staff6','Nurse'),
('Staff7','Reception'), ('Staff8','Nurse'),
('Staff9','Reception'), ('Staff10','Nurse'),

('Staff11','Reception'), ('Staff12','Nurse'),
('Staff13','Reception'), ('Staff14','Nurse'),
('Staff15','Reception'), ('Staff16','Nurse'),
('Staff17','Reception'), ('Staff18','Nurse'),
('Staff19','Reception'), ('Staff20','Nurse'),

('Staff21','Reception'), ('Staff22','Nurse'),
('Staff23','Reception'), ('Staff24','Nurse'),
('Staff25','Reception'), ('Staff26','Nurse'),
('Staff27','Reception'), ('Staff28','Nurse'),
('Staff29','Reception'), ('Staff30','Nurse'),

('Staff31','Reception'), ('Staff32','Nurse'),
('Staff33','Reception'), ('Staff34','Nurse'),
('Staff35','Reception'), ('Staff36','Nurse'),
('Staff37','Reception'), ('Staff38','Nurse'),
('Staff39','Reception'), ('Staff40','Nurse');
SELECT * FROM Staff
GO
------------------------------------------------------------
-- 4. STORED PROCEDURES
------------------------------------------------------------

-- Add new patient
CREATE PROCEDURE AddPatient
    @Name VARCHAR(50),
    @Age INT,
    @Gender VARCHAR(10)
AS
BEGIN
    INSERT INTO Patients(Name, Age, Gender)
    VALUES (@Name, @Age, @Gender);
END;
GO

-- Book appointment
CREATE PROCEDURE BookAppointment
    @PatientID INT,
    @DoctorID INT,
    @Date DATE
AS
BEGIN
    INSERT INTO Appointments(PatientID, DoctorID, AppointmentDate)
    VALUES (@PatientID, @DoctorID, @Date);
END;
GO

------------------------------------------------------------
-- 5. EXECUTE PROCEDURES (sample run)
------------------------------------------------------------

EXEC AddPatient 'Hassan', 28, 'Male';
EXEC BookAppointment 1, 1, '2026-05-01';

------------------------------------------------------------
-- 6. JOINS 
------------------------------------------------------------

SELECT 
    P.Name AS PatientName,
    D.Name AS DoctorName,
    A.AppointmentDate
FROM Patients P
JOIN Appointments A ON P.PatientID = A.PatientID
JOIN Doctors D ON A.DoctorID = D.DoctorID;

------------------------------------------------------------
-- 7. ERROR HANDLING (TRY-CATCH)
------------------------------------------------------------

BEGIN TRY
    -- intentional error (wrong data type)
    INSERT INTO Patients(Name, Age, Gender)
    VALUES ('Test', 'WrongData', 'Male');
END TRY
BEGIN CATCH
    PRINT 'Error occurred while inserting patient';
END CATCH;

------------------------------------------------------------
-- 8. TRANSACTIONS (ACID properties)
------------------------------------------------------------

BEGIN TRANSACTION;

BEGIN TRY
    INSERT INTO Billing (PatientID, Amount)
    VALUES (1, 5000);

    UPDATE Patients
    SET Age = Age + 1
    WHERE PatientID = 1;

    COMMIT;
END TRY
BEGIN CATCH
    ROLLBACK;
    PRINT 'Transaction failed, rolled back';
END CATCH;

------------------------------------------------------------
-- 9. CONCURRENCY CONTROL (SERIALIZABLE)
------------------------------------------------------------

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN TRANSACTION;

INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate)
VALUES (2, 2, '2026-05-02');

COMMIT;
GO

------------------------------------------------------------
-- 10. TRIGGER (auto action after insert)
------------------------------------------------------------

CREATE TRIGGER AfterAppointmentInsert
ON Appointments
AFTER INSERT
AS
BEGIN
    PRINT 'New appointment booked';

    -- auto create bill
    INSERT INTO Billing (PatientID, Amount)
    SELECT PatientID, 1000 FROM inserted;
END;
GO

-- Database designed in 3NF to remove redundancy
-- Foreign keys used to maintain relationships between tables
-- Stored procedures implemented for modular operations
-- Transactions used to maintain ACID properties
-- Concurrency control applied using SERIALIZABLE isolation level
-- Triggers used for automation
SELECT 
    Doctors.DoctorID,
    Doctors.Name,
    Departments.DeptName
FROM Doctors
INNER JOIN Departments
ON Doctors.DeptID = Departments.DeptID;

CREATE PROCEDURE GetDoctorAppointments1
    @DoctorID INT,
    @Date DATE
AS
BEGIN
    SELECT AppointmentTime
    FROM Appointments
    WHERE DoctorID = @DoctorID
    AND AppointmentDate = @Date;
END;
ALTER TABLE Appointments
ADD AppointmentTime TIME;

ALTER TABLE Appointments
ADD CONSTRAINT UQ_Doctor_Date_Time
UNIQUE (DoctorID, AppointmentDate, AppointmentTime);



CREATE PROCEDURE BookAppointments
    @PatientID INT,
    @DoctorID INT,
    @Date DATE,
    @Time TIME
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM Appointments
        WHERE DoctorID = @DoctorID
        AND AppointmentDate = @Date
        AND AppointmentTime = @Time
    )
    BEGIN
        SELECT 'Doctor is busy' AS Message;
        RETURN;
    END

    INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, AppointmentTime)
    VALUES (@PatientID, @DoctorID, @Date, @Time);

    SELECT 'Appointment successful' AS Message;
END;
GO

DELETE FROM Appointments;
EXEC BookAppointments 1, 1, '2026-05-05', '10:00:00';
EXEC BookAppointments 7, 6, '2026-05-05', '15:00:00';
SELECT * FROM Patients;
SELECT * FROM Doctors;
select * from Appointments
    INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, AppointmentTime)
    VALUES (@PatientID, @DoctorID, @Date, @Time);
END;

INSERT INTO Patients (Name, Age, Gender) VALUES 
('Ameera', 29, 'Female');
select * from Patients
INSERT INTO Doctors (Name, DeptID) VALUES 
('Dr umair', 3);
select * from Doctors
------------------------------------------------------------

------------------------------------------------------------
-- END OF PROJECT
------------------------------------------------------------