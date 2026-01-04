import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner"; // Thư viện hiển thị thông báo dạng pop up

function App() {
  return (
    <>
      <Toaster richColors />
      {/* Phải để ở cấp cao nhất của ứng dụng để hiển thị thông báo ở tất cả các trang*/}
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* protected routes */}
          <Route path="/" element={<ChatAppPage />} />
          {/* todo: tạo protected route */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
