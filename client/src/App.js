import './App.css';
// Router
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// Store Manager
import Recoil from "recoil";
// Fonts
import "@fontsource/montserrat";
// Pages
import Signup from "./pages/auth/signup";
import Signin from "./pages/auth/signin";
import ForgotPassword from './pages/auth/forgotpassword';
import PasswordReset from './pages/auth/passwordreset';

// User Pages
import UserAccountHomePage from "./pages/acct/userAcctHomePage.js";

// Admin Pages
import AdminHomePage from "./pages/admin/admin.js";

// Not Found
import { NotFoundPage } from './pages/NotFoundPage';

// About Us
import { AboutUs } from './pages/home/aboutus';
// Our Service
import { OurService } from './pages/home/ourservice';
// Home Page
import { HomePage } from './pages/home/home.js';
function App() {
  return (
    <Recoil.RecoilRoot>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/signin" element={<Signin />} />
            <Route path="/auth/forgotpassword" element={<ForgotPassword />} />
            <Route path="/auth/passwordreset/:token" element={<PasswordReset />} />

            <Route path="/acct/home" element={< UserAccountHomePage/>} />
            <Route path="/admin" element={<AdminHomePage />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/ourservice/:_id" element={<OurService />} />
            <Route path="*" element={<NotFoundPage/>} />
          </Routes>
          
        </BrowserRouter>
      </div>
    </Recoil.RecoilRoot>
  );
}

export default App;
