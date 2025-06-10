import { RouterProvider } from "react-router-dom";
import appRouter from "./router/AppRouter";

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
