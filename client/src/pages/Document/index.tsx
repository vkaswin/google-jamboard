import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Header from "./Header";
import ToolBar from "./ToolBar";
import SketchBoard from "./SketchBoard";
import Shapes from "./Shapes";
import { getDocumentById, updateImage } from "@/services/Document";
import { DocumentDetail, ShapeDetail } from "@/types/Document";

import styles from "./Document.module.scss";

// Aspect ratio 16 / 9
let dimension = {
  width: 3840,
  height: 2160,
};

let canvasDimension = {
  width: dimension.width / 2,
  height: dimension.height / 2,
};

let shapes: ShapeDetail[] = [
  {
    type: "rectangle",
    props: {
      width: 555.699,
      height: 789.071,
      translateX: 2195.94,
      translateY: 533.011,

      rotate: 0,
    },
  },
  {
    type: "triangle",
    props: {
      width: 400,
      height: 400,
      translateX: 3158.39,
      translateY: 1472.78,
      rotate: 0,
    },
  },
  {
    type: "semi-circle",
    props: {
      width: 400,
      height: 200,
      translateX: 1058.6,
      translateY: 1592.04,
      rotate: 0,
    },
  },
  {
    type: "arrow",
    props: {
      width: 400,
      height: 400,
      translateX: 2073.17,
      translateY: 1515.99,
      rotate: 0,
    },
  },
  {
    type: "square",
    props: {
      width: 400,
      height: 400,
      translateX: 557.726,
      translateY: 310.502,
      rotate: 0,
    },
  },
  {
    type: "circle",
    props: {
      width: 400,
      height: 400,
      translateX: 3139.13,
      translateY: 194.916,
      rotate: 0,
    },
  },
  {
    type: "diamond",
    props: {
      width: 400,
      height: 400,
      translateX: 621.94,
      translateY: 1048.96,
      rotate: 0,
    },
  },
];

const DocumentPage = () => {
  let { user } = useAuth();

  let [tool, setTool] = useState(2);

  let [shape, setShape] = useState(0);

  let [sketch, setSketch] = useState(0);

  let [sketchColor, setSketchColor] = useState(0);

  let [documentDetail, setDocumentDetail] = useState({} as DocumentDetail);

  let containerRef = useRef<HTMLDivElement | null>(null);

  let boardRef = useRef<HTMLDivElement | null>(null);

  let { documentId } = useParams();

  useLayoutEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getDocumentDetail();
  }, [documentId]);

  let getDocumentDetail = async () => {
    if (!documentId) return;

    try {
      let {
        data: { data },
      } = await getDocumentById(documentId);
      setDocumentDetail(data);
    } catch (error) {
      console.log(error);
    }
  };

  let handleResize = () => {
    if (!containerRef.current || !boardRef.current) return;

    let { clientHeight } = containerRef.current;

    let height = clientHeight - 30;
    let width = (height / 9) * 16;

    boardRef.current.style.transform = `scaleX(${
      width / dimension.width
    }) scaleY(${height / dimension.height}) translate(-50%, -50%)`;
  };

  let clearCanvas = () => {
    let canvas = document.querySelector("canvas");
    if (!canvas) return;
    let context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvasDimension.width, canvasDimension.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      updateCanvasImage(blob);
    });
  };

  let updateCanvasImage = async (blob: Blob) => {
    if (!documentId) return;

    try {
      let formData = new FormData();
      formData.append("file", blob);
      await updateImage(documentId, formData);
    } catch (error) {
      console.log(error);
    }
  };

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
        onClearFrame={clearCanvas}
      />
      <div ref={containerRef} className={styles.container}>
        <div
          ref={boardRef}
          className={styles.board}
          style={{ width: dimension.width, height: dimension.height }}
        >
          <SketchBoard
            tool={tool}
            sketch={sketch}
            sketchColor={sketchColor}
            documentId={documentId}
            image={documentDetail.image}
            dimension={canvasDimension}
            onUpdateImage={updateCanvasImage}
          />
          {shapes.map((shape, index) => {
            return <Shapes key={index} {...shape} />;
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default DocumentPage;
