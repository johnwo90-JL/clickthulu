import { Link, Outlet, useLocation } from "react-router-dom";
import "./App.css";

function App() {
  const location = useLocation();
  const hideNav = location.pathname === "/background";

  return (
    <>
      {/* {!hideNav && (
        <nav style={{ margin: "24px" }}>
          <Link to="/cards" style={{ marginRight: "16px" }}>
            Kort
          </Link>
          <Link to="/gambling" style={{ marginRight: "16px" }}>
            Kiste
          </Link>
          <Link to="/tempug" style={{ marginRight: "16px" }}>
            Upgrades
          </Link>
          <Link to="/xpbartest" style={{ marginRight: "16px" }}>
            XPBar Test
          </Link>
          <Link to="/background">Bakgrunn</Link>
        </nav>
      )} */}
      <Outlet />
    </>
  );
}

export default App;
