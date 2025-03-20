import express from "express";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import pinRouter from "./routes/pin.route.js";
import commentRouter from "./routes/comment.route.js";
import boardRouter from "./routes/board.route.js";
import connectDB from "./utils/connectDB.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(fileUpload());

// API Routes
app.use("/users", userRouter);
app.use("/pins", pinRouter);
app.use("/comments", commentRouter);
app.use("/boards", boardRouter);

// Default route to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

// Handle invalid routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
