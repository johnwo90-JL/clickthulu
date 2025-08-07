import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect } from "react";

import { base_url as base } from "../../../config";
import App from "../../App.jsx";
import Home from "../pages/Home";
import Game from "../pages/Game";
import RegisterAndLogin from "../pages/register&login";


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
                }
            ]
        }
    ],
    {
        basename: base,
    }
)

function BaseInjector({ base }) {
    useEffect(() => {
        let baseElement = document.querySelector('base');
        if (!baseElement) {
            baseElement = document.createElement('base');
            document.head.appendChild(baseElement);
        }
        baseElement.setAttribute('href', base);
    }, [base]);
    return null; 
}

const AppRouter = () => {
    return (
    <>
        <BaseInjector base={base} />
        <RouterProvider router={router} />
    </>
    )
}

export default AppRouter;