import * as React from "react";
import * as ReactDOM from "react-dom";

function render() {
  const App = require("./components/App").App;
  ReactDOM.render(
    <App compiler="TypeScript" framework="React" />,
    document.getElementById("root")
  );
}

render();

if (module.hot) {
  module.hot.accept("./components/App", render);
}
