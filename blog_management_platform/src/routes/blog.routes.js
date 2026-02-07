import express from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getPostById,
  updatePost,
} from "../controllers/blog.controller.js";
import { verifyToken } from "./../middleware/verifyToken.js";
import { authorizedRoles } from "./../middleware/role.js";

const blogRouter = express.Router();

blogRouter.get("/", verifyToken, getAllPost);
blogRouter.get("/:id", verifyToken, getPostById);
blogRouter.post("/", verifyToken, createPost);
blogRouter.put(
  "/:id",
  verifyToken,
  authorizedRoles("admin", "user"),
  updatePost,
);
blogRouter.delete("/:id", verifyToken, authorizedRoles("admin"), deletePost);

export default blogRouter;
