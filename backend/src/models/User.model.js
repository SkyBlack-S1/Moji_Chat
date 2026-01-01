import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // duy nhất
      trim: true, // tự động bỏ khoảng trắng đầu và cuối
      lowercase: true // chuyển về chữ thường
    },
    hashedPassword: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    avatarUrl: {
      type: String, // link CDN để hiển thị hình
    },
    avatarId: {
      type: String, // Clouinary public_id để xóa hình
    },
    bio: {
      type: String,
      maxlength: 500
    },
    phone: {
      type: String,
      sparse: true, // cho phép null, nhưng không được trùng
    }
  }, 
  {
  timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
export default User;