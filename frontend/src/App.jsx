import { Link, Outlet } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <>
      <nav style={{ margin: "24px" }}>
        <Link to="/cards" style={{ marginRight: "16px" }}>
          Kort
        </Link>
        <Link to="/gambling">Kiste</Link>
      </nav>
      <Outlet />
    </>
  );
}

export default App;
