import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";

import { base_url as base } from "../../config";
import App from "../App.jsx";
import Home from "../pages/home";
import Game from "../pages/game";
import RegisterAndLogin from "../pages/register&login";
import Cards from "../pages/cards.jsx";
import Gambling from "../pages/gambling";
import TempUpgrades from "../pages/tempug.jsx";
import BackgroundPage from "../pages/Background.jsx";
import XPBarTest from "../pages/xpbartest.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <div>Page Not Found</div>, //Temporary error handling
      children: [
        // Link examples:
        // http://localhost:5173/clickhulu/registerandlogin
        // http://localhost:5173/clickhulu/game
        {
          index: true, // This will match the root path "/"
          element: <Home />,
        },
        {
          path: "registerandlogin", // path for register and login
          element: <RegisterAndLogin />,
        },
        {
          path: "game", // path for the game page
          element: <Game />,
        },
        {
          path: "cards", // path for the cards page
          element: <Cards />,
        },
        {
          path: "tempug", // Path for temp upgrades
          element: <TempUpgrades />,
        },
        {
          path: "background", // Backgroundimg
          element: <BackgroundPage />,
        },
        {
          path: "gambling", // path for the gambling page
          element: <Gambling />,
        },
        {
          path: "xpbartest", // path for XPBar test
          element: <XPBarTest />,
        },
      ],
    },
  ],
  {
    basename: base,
  }
);

function BaseInjector({ base }) {
  useEffect(() => {
    let baseElement = document.querySelector("base");
    if (!baseElement) {
      baseElement = document.createElement("base");
      document.head.appendChild(baseElement);
    }
    baseElement.setAttribute("href", base);
  }, [base]);
  return null;
}

const AppRouter = () => {
  return (
    <>
      <BaseInjector base={base} />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
