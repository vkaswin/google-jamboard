import { Fragment, Suspense } from "react";
import { HashRouter } from "react-router-dom";
import AuthProvider from "@/context/AuthContext";
import Router from "@/router";

import "@/assets/scss/index.scss";

const App = () => {
  return (
    <Fragment>
      <HashRouter>
        <AuthProvider>
          <Suspense fallback="Loading...">
            <Router />
          </Suspense>
        </AuthProvider>
      </HashRouter>
    </Fragment>
  );
};

export default App;
