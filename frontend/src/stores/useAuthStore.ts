import { create } from "zustand";
import { toast } from "sonner";
export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false, // theo dõi trạng thái khi gọi api

  signUp: async () => {
    try {
      set({ loading: true });
      // gọi api
      toast.success(
        "Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập."
      );
    } catch (error) {
      console.error(error);
      toast.error("Đăng ký không thành công");
    } finally {
      set({ loading: false });
    }
  },
}));
