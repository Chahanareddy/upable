import { Routes, Route } from "react-router-dom";
import InvitationPage from "./components/InvitationPage";
import UserInfo from "./components/UserInfo";
import FutureCareer from "./components/FutureCareer";
import Results from "./components/Results";

function App() {

  return (
    <Routes>
      <Route path="/invitation-page" element={<InvitationPage />} />
      <Route path="/user-info" element={<UserInfo />} />
      <Route path="/future-career" element={<FutureCareer />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
