import { Fragment, Suspense, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/context/AuthContext";
import Router from "@/router";
import useAuth from "./hooks/useAuth";

import "react-toastify/dist/ReactToastify.css";
import "@/assets/scss/index.scss";

const App = () => {
  let { logout } = useAuth();

  useEffect(() => {
    document.addEventListener("unauthorized", logout);
    return () => {
      document.removeEventListener("unauthorized", logout);
    };
  }, []);

  return (
    <Fragment>
      <HashRouter>
        <AuthProvider>
          <Suspense fallback="Loading...">
            <Router />
          </Suspense>
        </AuthProvider>
      </HashRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeButton
      />
    </Fragment>
  );
};

export default App;
