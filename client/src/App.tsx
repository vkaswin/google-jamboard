import { Fragment } from "react";
import { HashRouter } from "react-router-dom";
import Routes from "@/router";

import "@/assets/scss/index.scss";

const App = () => {
  return (
    <Fragment>
      <HashRouter>
        <Routes />
      </HashRouter>
    </Fragment>
  );
};

export default App;
