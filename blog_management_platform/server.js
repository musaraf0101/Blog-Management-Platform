import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import blogRouter from "./src/routes/blog.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5000;

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/blogs",blogRouter)

app.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}`);
});
