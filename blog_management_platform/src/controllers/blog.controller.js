import { Blog } from "../models/Blog.js";

export const getAllPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const totalPost = await Blog.count();

    const posts = await Blog.findAllPaginated(limit, offset);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalpages: Math.ceil(totalPost / limit),
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Blog.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "post founded",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = await Blog.create({
      title,
      content,
      user_id: req.userId,
    });

    res.status(200).json({
      success: true,
      message: "new post created success",
      data: newPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const findPost = await Blog.findById(id);

    if (!findPost) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }

    if (Number(req.userId) !== Number(findPost.user_id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this post",
      });
    }

    const updatedPost = await Blog.update(id, { title, content });

    res.status(200).json({
      success: true,
      message: "post updated success",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(404).json({
        success: false,
        message: "this id post not found!",
      });
    }
    await Blog.delete(id);

    res.status(200).json({
      success: true,
      message: "delete success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};
