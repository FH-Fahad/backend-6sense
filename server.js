const express = require("express");
const app = express();

const cors = require("cors");

const connectDB = require("./Database/DBConnect");
const employeeRoute = require("./Routes/Employee");

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Employee API
app.use("/", employeeRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Click here: http://localhost:${PORT}`);
});
