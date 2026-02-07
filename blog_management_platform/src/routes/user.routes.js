import express from "express";
import { getAllUser, getUserById } from "../controllers/user.controller.js";
import { verifyToken } from "./../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/role.js";

const userRouter = express.Router();

userRouter.get("/", verifyToken, authorizedRoles("admin"), getAllUser);
userRouter.get("/:id", verifyToken, getUserById);

export default userRouter;
