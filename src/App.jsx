import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard.jsx";
import Parish from "./pages/Parish.jsx";
import Forane from "./pages/Forane.jsx";
import Koottayma from "./pages/Kootayama.jsx";
import Family from "./pages/Family.jsx";
import FamilyManagement from "./pages/FamilyManagement.jsx";
import FamilyTransactions from "./pages/Finance.jsx";
import MoveFamily from "./pages/moveFamily.jsx";
import MovePerson from "./pages/movePerson.jsx";
import Report from "./pages/Report.jsx";
import Statistics from "./pages/Statistics.jsx";
import FinanceSettings from "./pages/FinanceSettings.jsx";
import CommunitySettings from "./pages/CommunitySettings.jsx";
import OtherFundSettings from "./pages/OtherFundSettings.jsx";
// import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="parish" element={<Parish />} />
          <Route path="forane" element={<Forane />} />
          <Route path="koottayma" element={<Koottayma />} />
          <Route path="family" element={<Family />} />
          <Route path="familymanage" element={<FamilyManagement />} />
          <Route path="finance" element={<FamilyTransactions />} />
          <Route path="movefamily" element={<MoveFamily />} />
          <Route path="moveperson" element={<MovePerson />} />
          <Route path="report" element={<Report />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="financesettings" element={<FinanceSettings />} />
          <Route
            path="financesettings/community"
            element={<CommunitySettings />}
          />
          <Route path="financesettings/other" element={<OtherFundSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
