import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Authorization - Xác minh user là ai
export const protectedRoute = (req, res, next) => {
  try {
    // Lấy token từ header (browser)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Lấy phần thứ 2 sau chữ "Bearer" tức token

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }
    // Xác nhận token hợp lệ
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "Access token hết hạn hoặc không đúng" });
        }

        // Tìm user
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword"
        );

        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Trả user về trong req
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong auth.middleware.js", error);
    return res.status(500).json({ message: "Lỗi hê thống" });
  }
};
