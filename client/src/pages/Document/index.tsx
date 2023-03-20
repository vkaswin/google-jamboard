import { Fragment, useState } from "react";
import Header from "./Header";
import ToolBar from "./ToolBar";
import Board from "./Board";
import useAuth from "@/hooks/useAuth";

import styles from "./Document.module.scss";

const DocumentPage = () => {
  let { user } = useAuth();

  let [tool, setTool] = useState(2);

  let [shape, setShape] = useState(0);

  let [sketch, setSketch] = useState(0);

  let [sketchColor, setSketchColor] = useState(0);

  return (
    <Fragment>
      <Header user={user} />
      <ToolBar
        tool={tool}
        shape={shape}
        sketch={sketch}
        sketchColor={sketchColor}
        onSelectTool={setTool}
        onSelectShape={setShape}
        onSelectSketch={setSketch}
        onSelectSketchColor={setSketchColor}
      />
      <Board />
    </Fragment>
  );
};

export default DocumentPage;
