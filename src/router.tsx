import { createBrowserRouter } from "react-router-dom";
import EmbedApp from "./components/views/embed";
import Dashboard from "./components/views/dashboard";


export const Router = createBrowserRouter([
  {
    element: <Dashboard/>,
    index: true
  },

  {
    element: <EmbedApp/>,
    path: "/embed"
  }
]);