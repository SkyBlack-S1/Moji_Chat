import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// CONSTANT
const ACCESS_TOKEN_TTL = "30m"; // TTL tức Time to live -> Thời gian sống
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày tính theo ms

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
    console.error("Lỗi khi gọi signUp: ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Đăng nhập
export const signIn = async (req, res) => {
  try {
    // Lấy inputs từ người dùng
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    // Kiểm tra username có tồn tại không?
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "username hoặc password không chính xác",
      });
    }

    // Lấy hashedPassword trong db để so sánh với password input
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res.status(401).json({
        message: "username hoặc password không chính xác",
      });
    }

    // Nếu khớp, Tạo accessToken với JWT

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Tạo refreshToken
    const refreshToken = crypto.randomBytes(64).toString("hex"); // tạo 1 chuỗi ký tự ngẫu nhiên

    // Tạo session mới để lưu refreshToken
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // Trả refreshToken về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie ko thể bị truy cập bởi JS
      secure: true, // Đảm bảo chỉ gửi qua https
      sameSite: "none", // cho phép backend, frontend chạy trên 2 domain khác nhau
      maxAge: REFRESH_TOKEN_TTL,
    });

    // Trả accessToken về trong res
    return res
      .status(200)
      .json({ message: `User ${user.displayName} đã logged in!`, accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi signIn: ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Đăng xuất
export const signOut = async (req, res) => {
  try {
    // Lấy refreshToken từ cookie
    const token = req.cookies?.refreshToken; // phải có 'cookie-parser' nếu ko sẽ bị undefine
    if (token) {
      // Xóa refreshToken trong Session
      await Session.deleteOne({ refreshToken: token });
      // Xóa refreshToken trong cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut: ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
