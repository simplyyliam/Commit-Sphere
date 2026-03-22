import { createBrowserRouter } from "react-router-dom";
import EmbedApp from "./components/views/embed";
import App from "./App";


export const Router = createBrowserRouter([
  {
    element: <App/>,
    index: true
  },

  {
    element: <EmbedApp/>,
    path: "/embed"
  }
]);