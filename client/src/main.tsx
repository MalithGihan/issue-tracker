import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

import { Provider } from "react-redux";
import { store } from "./app/store";
import { ThemeProvider } from "./theme/ThemeProvider";
import { Toaster } from "react-hot-toast";
import AppBootLoader from "./components/Loader/AppBootLoader";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <AppBootLoader ms={700}>
      <RouterProvider router={router} />
      </AppBootLoader>
      <Toaster position="top-right" />
    </ThemeProvider>
  </Provider>
);
