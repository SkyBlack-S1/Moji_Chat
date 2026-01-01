import bcrypt from "bcrypt";
import User from "../models/User.js";

// Đăng ký
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName, lastName",
      });
    }

    // Kiểm tra username đã tồn tại chưa
    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res.status(409).json({ message: "username đã tồn tại" });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10 (Trộn password gốc với chuỗi ngẫu nhiên 2^10 lần)

    // Tạo user mới
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    // Return
    return res.sendStatus(204);
  } catch (error) {
    console.log("Lỗi khi gọi signUp: ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Đăng nhập
export const signIn = async (req, res) => {};
