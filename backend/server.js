require("dotenv").config();
const cors = require("cors");
const express = require("express");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// auth
const authenticateUser = require("./middleware/auth");

// router
const userRouter = require("./routes/user");
const workshopRouter = require("./routes/workshop");

// login
const { login } = require("./controllers/login");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", login);

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.use("/api/user/", authenticateUser, userRouter);
app.use("/api/workshop/", authenticateUser, workshopRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
