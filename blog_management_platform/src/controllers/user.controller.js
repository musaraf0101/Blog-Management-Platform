import { User } from "../models/User.js";

export const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const totalUser = await User.count();

    const users = await User.findAllPaginated(limit, offset);

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalUser / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "user details founded",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      data: error.message,
    });
  }
};
