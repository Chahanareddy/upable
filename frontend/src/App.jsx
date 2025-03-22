import { Routes, Route, Navigate } from "react-router-dom";
import InvitationPage from "./components/InvitationPage";
import UserInfo from "./components/UserInfo";
import FutureCareer from "./components/FutureCareer";
import Results from "./components/Results";
import ChatBot from "./components/ChatBot";


function App() {
  return (
    <Routes>
      //Automatically open invitation page
      <Route path="/" element={<Navigate to="/invitation-page" replace />} />

      <Route path="/invitation-page" element={<InvitationPage />} />
      <Route path="/user-info" element={<UserInfo />} />
      <Route path="/future-career" element={<FutureCareer />} />
      <Route path="/results" element={<Results />} />
      <Route path="/career-chat" element={<ChatBot />} />
    </Routes>
  );
}

export default App;
