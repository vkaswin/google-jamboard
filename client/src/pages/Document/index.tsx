import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Header from "./Header";
import ToolBar from "./ToolBar";
import SketchBoard from "./SketchBoard";
import Shapes from "./Shapes";
import Resizer from "./Resizer";
import { getDocumentById, updateImage } from "@/services/Document";
import { DocumentDetail } from "@/types/Document";

import styles from "./Document.module.scss";
import DropDown from "@/components/DropDown";

// Aspect ratio 16 / 9
let dimension = {
  width: 3840,
  height: 2160,
};

let canvasDimension = {
  width: dimension.width / 2,
  height: dimension.height / 2,
};

const DocumentPage = () => {
  let { user } = useAuth();

  let [tool, setTool] = useState(2);

  let [shape, setShape] = useState(0);

  let [sketch, setSketch] = useState(0);

  let [sketchColor, setSketchColor] = useState(0);

  let [documentDetail, setDocumentDetail] = useState({} as DocumentDetail);

  let containerRef = useRef<HTMLDivElement | null>(null);

  let boardRef = useRef<HTMLDivElement | null>(null);

  let [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

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

  let handleClickShape = (id: string) => {
    setSelectedShapeId(id);
  };

  let handleDuplicateShape = () => {
    if (!selectedShapeId) return;
    console.log(selectedShapeId);
  };

  let handleDeleteShape = () => {
    if (!selectedShapeId) return;

    try {
      let index = documentDetail.shapes.findIndex(
        ({ _id }) => _id === selectedShapeId
      );
      if (index === -1) return;
      let shapes = [...documentDetail.shapes];
      shapes.splice(index, 1);
      setDocumentDetail({ ...documentDetail, shapes });
    } catch (error) {
      console.log(error);
    }
  };

  let selectedShape = useMemo(() => {
    if (!selectedShapeId) return;
    return documentDetail.shapes.find(({ _id }) => _id === selectedShapeId);
  }, [selectedShapeId]);

  return (
    <Fragment>
      <Header user={user} onClearFrame={clearCanvas} />
      <div ref={containerRef} className={styles.container}>
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
          {documentDetail.shapes &&
            documentDetail.shapes.map((shape, index) => {
              return (
                <Shapes
                  key={index}
                  onClick={handleClickShape}
                  selectedShapeId={selectedShapeId}
                  {...shape}
                />
              );
            })}
          {selectedShape && <Resizer shape={selectedShape} />}
        </div>
      </div>

      <DropDown
        selector={`button[shape-id='${selectedShapeId}']`}
        className={styles.shape_dropdown}
        placement="bottom"
        aria-disabled={!!selectedShapeId}
      >
        <DropDown.Item onClick={handleDuplicateShape}>
          <i className="bx-duplicate"></i>
          <span>Duplicate</span>
        </DropDown.Item>
        <DropDown.Item onClick={handleDeleteShape}>
          <i className="bx-trash"></i>
          <span>Delete</span>
        </DropDown.Item>
      </DropDown>
    </Fragment>
  );
};

export default DocumentPage;
