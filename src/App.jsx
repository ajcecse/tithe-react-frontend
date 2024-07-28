import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard.jsx";
import Parish from "./pages/Parish.jsx";
import Forane from "./pages/Forane.jsx";
import Koottayma from "./pages/Kootayama.jsx";
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
