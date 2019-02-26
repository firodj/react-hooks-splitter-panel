import React from "react";
import Splitter from "./Splitter";

function App(props) {
  return <Splitter orientation="horizontal">
      <div>Left</div>
      <Splitter orientation="vertical">
        <div>Center</div>
        <Splitter orientation="horizontal">
          <div>Output</div>
          <div>Input</div>
        </Splitter>
      </Splitter>
      <div>Right</div>
    </Splitter>;
};

export default App;

