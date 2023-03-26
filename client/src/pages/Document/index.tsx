import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Document/Header";
import ToolBar from "@/components/Document/ToolBar";
import SketchBoard from "@/components/Document/SketchBoard";
import Shapes from "@/components/Document/Shapes";
import DropDown from "@/components/DropDown";
import { getDocumentById, clearDocument } from "@/services/Document";
import { createShape, deleteShape } from "@/services/Shape";
import { updateImage } from "@/services/Image";
import { getStaticUrl } from "@/utils";
import { DocumentDetail, ShapeDetail } from "@/types/Document";

import styles from "./Document.module.scss";
import { shapes } from "@/constants";

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
  let { user, logout } = useAuth();

  let [tool, setTool] = useState(2);

  let [shape, setShape] = useState(1);

  let [sketch, setSketch] = useState(0);

  let [sketchColor, setSketchColor] = useState(0);

  let [documentDetail, setDocumentDetail] = useState({} as DocumentDetail);

  let containerRef = useRef<HTMLDivElement | null>(null);

  let boardRef = useRef<HTMLDivElement | null>(null);

  let [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  let [tempShape, setTempShape] = useState<ShapeDetail | null>(null);

  let mouseDownEvent = useRef({
    pageX: 0,
    pageY: 0,
  });

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

    let {
      data: { data },
    } = await getDocumentById(documentId);
    setDocumentDetail(data);
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

  let handleClearFrame = async () => {
    if (!documentId) return;

    await clearDocument(documentId);
    let canvas = document.querySelector("canvas");
    if (!canvas) return;
    let context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvasDimension.width, canvasDimension.height);
    let documentData = { ...documentDetail };
    documentData.shapes = [];
    documentData.image = "";
    setDocumentDetail(documentData);
  };

  let updateCanvasImage = async (blob: Blob) => {
    if (!documentId) return;

    let formData = new FormData();
    formData.append("file", blob);
    await updateImage(documentId, formData);
  };

  let handleClickShape = (id: string) => {
    setSelectedShapeId(id);
  };

  let clearSelectedShapeId = () => {
    setSelectedShapeId(null);
  };

  let handleDuplicateShape = () => {
    if (!selectedShapeId) return;
  };

  let handleDeleteShape = async () => {
    if (!selectedShapeId) return;

    let index = documentDetail.shapes.findIndex(
      ({ _id }) => _id === selectedShapeId
    );
    if (index === -1) return;
    await deleteShape(selectedShapeId);
    let shapes = [...documentDetail.shapes];
    shapes.splice(index, 1);
    setDocumentDetail({ ...documentDetail, shapes });
    setSelectedShapeId(null);
  };

  let cursor = useMemo(() => {
    let path = "";
    if (tool === 0) {
      path = `/cursor/color-${sketchColor}.png`;
    } else if (tool === 1) {
      path = "/cursor/color-3.png";
    } else if (tool === 6) {
      path = "/cursor/color-5.png";
    }

    return path
      ? `url(${getStaticUrl(path)}), auto`
      : tool === 4
      ? "crosshair"
      : "default";
  }, [tool, sketchColor]);

  let handleMouseMove = ({ pageX, pageY }: MouseEvent) => {
    setTempShape((tempShape) => {
      if (!tempShape || !boardRef.current) return tempShape;

      let { width, height } = boardRef.current.getBoundingClientRect();
      let { clientWidth, clientHeight } = boardRef.current;

      let scaleX = clientWidth / width;
      let scaleY = clientHeight / height;

      let shape = { ...tempShape };
      shape.props.width = (pageX - mouseDownEvent.current.pageX) * scaleX;
      shape.props.height = (pageY - mouseDownEvent.current.pageY) * scaleY;

      return shape;
    });
  };

  let handleMouseUp = (event: MouseEvent) => {
    window.removeEventListener("mousemove", handleMouseMove);
    setTempShape((tempShape) => {
      if (tempShape) handleAddShape(tempShape);
      return tempShape;
    });
  };

  let handleAddShape = async (shapeDetail: ShapeDetail) => {
    if (!documentId) return;

    let body = {
      type: shapeDetail.type,
      props: shapeDetail.props,
      documentId,
    };

    let {
      data: { data },
    } = await createShape(body);
    let documentData = { ...documentDetail };
    documentData.shapes.push(data);
    setTool(2);
    setDocumentDetail(documentData);
    setSelectedShapeId(data._id);
    setTempShape(null);
  };

  let handleMouseDown = ({ pageX, pageY }: React.MouseEvent) => {
    if (!boardRef.current) return;

    let { width, height, left, top } = boardRef.current.getBoundingClientRect();
    let { clientWidth, clientHeight } = boardRef.current;

    let scaleX = clientWidth / width;
    let scaleY = clientHeight / height;

    let shapeDetail: ShapeDetail = {
      _id: crypto.randomUUID(),
      type: shapes[shape].type,
      props: {
        width: 1,
        height: 1,
        rotate: 0,
        translateX: (pageX - left) * scaleX,
        translateY: (pageY - top) * scaleY,
      },
    };
    mouseDownEvent.current = {
      pageX,
      pageY,
    };
    setTempShape(shapeDetail);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  return (
    <Fragment>
      <Header user={user} logout={logout} onClearFrame={handleClearFrame} />
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
          id="whiteboard"
          className={styles.board}
          style={{
            cursor,
            width: dimension.width,
            height: dimension.height,
          }}
          {...(tool === 4 && { onMouseDown: handleMouseDown })}
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
            documentDetail.shapes.map((shape) => {
              return (
                <Shapes
                  key={shape._id}
                  shape={shape}
                  selectedShapeId={selectedShapeId}
                  onClick={handleClickShape}
                  onBlur={clearSelectedShapeId}
                />
              );
            })}
          {tempShape && <Shapes shape={tempShape} />}
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
