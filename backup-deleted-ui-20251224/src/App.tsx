import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterDemo from "./pages/RegisterDemo";
import Profile from "./pages/Profile";
import Overview from "./pages/profile/Overview";
import PlaceholderPage from "./pages/profile/PlaceholderPage";
import QlikLab from "./pages/QlikLab";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#060d1e] to-[#030712] text-white">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/*" element={<Profile />}>
            <Route index element={<Overview />} />
            <Route path="positions" element={<PlaceholderPage title="Positions" />} />
            <Route path="performance" element={<PlaceholderPage title="Performance" />} />
            <Route path="insights" element={<PlaceholderPage title="Insights" />} />
            <Route path="social-trading" element={<PlaceholderPage title="Social trading" />} />
            <Route path="prop-trading" element={<PlaceholderPage title="Prop trading" />} />
            <Route path="watchlist" element={<PlaceholderPage title="Watchlist" />} />
            <Route path="history" element={<PlaceholderPage title="History" />} />
            <Route path="risk" element={<PlaceholderPage title="Risk" />} />
            <Route path="verification" element={<PlaceholderPage title="Verification" />} />
            <Route path="funds" element={<PlaceholderPage title="Funds" />} />
          </Route>
          <Route path="/qlik-lab" element={<QlikLab />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-demo" element={<RegisterDemo />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
