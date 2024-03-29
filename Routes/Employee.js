const express = require("express");
const router = express.Router();
const Employee = require("../Database/Employee.Schema");

// Task 1: Create API to store employees
router.post("/", async (req, res) => {
  const { firstName, lastName, email, phone, blocked } = req.body;

  try {
    // Check if the email already exists
    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Create a new employee if the email is not in use
    const employee = new Employee({
      firstName,
      lastName,
      email,
      phone,
      blocked,
    });

    // Save the employee
    const saveEmployee = await employee.save();

    const responseEmployee = await Employee.findById(saveEmployee._id).select(
      "firstName lastName email phone blocked"
    );

    res.json({ message: "Employee added successfully", responseEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 2: Show all employees as a list
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().select(
      "firstName lastName email phone blocked"
    );

    const totalEmployees = employees.length;

    res.json({ message: "All Employees", totalEmployees, employees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 3: Show details of a specific employee
router.get("/:id", getEmployee, async (req, res) => {
  res.json(res.employee);
});

// Task 4: Update user info (excluding email)
router.patch("/:id", getEmployee, async (req, res) => {
  const updatedFields = [];

  if (req.body.email != null) {
    return res.status(400).json({ message: "Email cannot be updated" });
  }

  if (req.body.firstName != null) {
    res.employee.firstName = req.body.firstName;
    updatedFields.push(`Updated firstName: ${req.body.firstName}`);
  }
  if (req.body.lastName != null) {
    res.employee.lastName = req.body.lastName;
    updatedFields.push(`Updated lastName: ${req.body.lastName}`);
  }
  if (req.body.phone != null) {
    res.employee.phone = req.body.phone;
    updatedFields.push(`Updated phone: ${req.body.phone}`);
  }

  try {
    const updatedEmployee = await res.employee.save();
    res.json({ message: "Employee updated", updatedFields, updatedEmployee });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Task 5: Block/unblock an employee
router.patch("/:id/block", getEmployee, async (req, res) => {
  res.employee.blocked = !res.employee.blocked;
  try {
    const blockedEmployee = await res.employee.save();
    res.json(blockedEmployee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Task 6: Delete an employee
router.delete("/:id", getEmployee, async (req, res) => {
  try {
    await res.employee.deleteOne();
    res.json({ message: "Employee Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//middleware
async function getEmployee(req, res, next) {
  let employee;
  try {
    employee = await Employee.findById(req.params.id).select(
      "firstName lastName email phone blocked"
    );
    if (employee == null) {
      return res.status(404).json({ message: "Employee Not Found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.employee = employee;
  next();
}

module.exports = router;
