import { Routes, Route, } from "react-router-dom";
import SigninForm from './login/login';
import SignupForm from './login/signup';
import SigninHomePage from "./meeting/singinhomepage";
import Meeting from "./meeting/meeting";
import MeetingHome from "./meeting/home";

function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SigninForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/signinhomepage" element={<SigninHomePage />} />
      <Route path="/meeting" element={<Meeting />} />
      <Route path="/" element={<SigninForm />} />
      <Route path="/meetHome" element={<MeetingHome />} />
    </Routes>
  );
}

export default App;
