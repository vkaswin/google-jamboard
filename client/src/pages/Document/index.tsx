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
import Header from "@/components/Header";
import ToolBar from "@/components/ToolBar";
import SketchBoard from "@/components/SketchBoard";
import Shapes from "@/components/Shapes";
import DropDown from "@/components/DropDown";
import Slides from "@/components/Slides";
import Portal from "@/components/Portal";
import { getDocumentById, clearDocument } from "@/services/Document";
import { createShape, deleteShape, updateShape } from "@/services/Shape";
import { updateCanvas } from "@/services/Canvas";
import { getStaticUrl } from "@/utils";
import { shapes } from "@/constants";
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

const DocumentPage = () => {
  let { user, logout } = useAuth();

  let [tool, setTool] = useState(2);

  let [shape, setShape] = useState(1);

  let [sketch, setSketch] = useState(0);

  let [sketchColor, setSketchColor] = useState(0);

  let [documentDetail, setDocumentDetail] = useState({} as DocumentDetail);

  let { slides } = documentDetail;

  let containerRef = useRef<HTMLDivElement | null>(null);

  let slideRef = useRef<HTMLElement | null>(null);

  let [activeSlide, setActiveSlide] = useState<number>(0);

  let [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  let [tempShape, setTempShape] = useState<ShapeDetail | null>(null);

  let [scale, setScale] = useState({ x: 1, y: 1 });

  let mouseDownEvent = useRef({
    pageX: 0,
    pageY: 0,
  });

  let { documentId } = useParams();

  useLayoutEffect(() => {
    handleResize();
  }, []);

  let activeSlideId = useMemo(() => {
    if (!slides || slides.length === 0) return;
    let slide = slides.find((_, index) => index === activeSlide);
    if (!slide) return;
    return slide._id;
  }, [activeSlide, slides]);

  useEffect(() => {
    if (!activeSlideId) return;
    slideRef.current = document.querySelector(
      `[slide-id='${activeSlideId}']`
    ) as HTMLElement;
    slideRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [activeSlideId]);

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
    if (!containerRef.current) return;

    let { clientHeight } = containerRef.current;

    let height = clientHeight - 30;
    let width = (height / 9) * 16;

    setScale({
      ...scale,
      x: width / dimension.width,
      y: height / dimension.height,
    });
  };

  let handleClearFrame = async () => {
    if (!documentId) return;

    // await clearDocument(documentId);
    // let canvas = document.querySelector("canvas");
    // if (!canvas) return;
    // let context = canvas.getContext("2d");
    // if (!context) return;
    // context.clearRect(0, 0, canvasDimension.width, canvasDimension.height);
    // let documentData = { ...documentDetail };
    // documentData.shapes = [];
    // documentData.image = "";
    // setDocumentDetail(documentData);
  };

  let handleUpdateCanvas = async (canvasId: string, blob: Blob) => {
    let formData = new FormData();
    formData.append("file", blob);
    await updateCanvas(canvasId, formData);
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
    debugger;
    if (
      !documentId ||
      !activeSlideId ||
      !selectedShapeId ||
      !slides ||
      slides.length === 0
    )
      return;

    let shapeIndex = slides[activeSlide].shapes.findIndex(
      ({ _id }) => _id === selectedShapeId
    );
    if (shapeIndex === -1) return;

    await deleteShape(documentId, {
      slideId: activeSlideId,
      shapeId: selectedShapeId,
    });

    let doucmentData = { ...documentDetail };
    doucmentData.slides[activeSlide].shapes.splice(shapeIndex, 1);
    setDocumentDetail(doucmentData);
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
      if (!tempShape || !slideRef.current) return tempShape;

      let { width, height } = slideRef.current.getBoundingClientRect();
      let { clientWidth, clientHeight } = slideRef.current;

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

  let handleUpdateShape = async (shape: Omit<ShapeDetail, "type">) => {
    await updateShape(shape._id, shape);
  };

  let handleAddShape = async (shapeDetail: ShapeDetail) => {
    if (!documentId) return;

    // let body = {
    //   type: shapeDetail.type,
    //   props: shapeDetail.props,
    //   documentId,
    // };

    // let {
    //   data: { data },
    // } = await createShape(body);
    // let documentData = { ...documentDetail };
    // documentData.shapes.push(data);
    // setTool(2);
    // setDocumentDetail(documentData);
    // setSelectedShapeId(data._id);
    // setTempShape(null);
  };

  let handleMouseDown = ({ pageX, pageY }: React.MouseEvent) => {
    if (!slideRef.current) return;

    let { width, height, left, top } = slideRef.current.getBoundingClientRect();
    let { clientWidth, clientHeight } = slideRef.current;

    let scaleX = clientWidth / width;
    let scaleY = clientHeight / height;

    let isTextBox = tool == 5;

    let shapeDetail: ShapeDetail = {
      _id: crypto.randomUUID(),
      type: isTextBox ? "text-box" : shapes[shape].type,
      props: {
        width: isTextBox ? 250 : 1,
        height: isTextBox ? 150 : 1,
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
      <Header user={user} logout={logout} onClearFrame={handleClearFrame}>
        <Slides
          totalSlides={slides?.length || 0}
          activeSlide={activeSlide}
          onChange={setActiveSlide}
        />
      </Header>
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
        {slides &&
          slides.length > 0 &&
          slides.map((slide) => {
            return (
              <div key={slide._id} className={styles.slide}>
                <div
                  slide-id={slide._id}
                  className={styles.board}
                  style={{
                    cursor,
                    width: dimension.width,
                    height: dimension.height,
                    transform: `scale(${scale.x},${scale.y}) translate(-50%, -50%)`,
                  }}
                  {...([4, 5].includes(tool) && {
                    onMouseDown: handleMouseDown,
                  })}
                >
                  <SketchBoard
                    tool={tool}
                    sketch={sketch}
                    sketchColor={sketchColor}
                    canvas={slide.canvas}
                    dimension={canvasDimension}
                    onUpdateCanvas={handleUpdateCanvas}
                  />
                  {slide.shapes &&
                    slide.shapes.map((shape) => {
                      return (
                        <Shapes
                          key={shape._id}
                          shape={shape}
                          slideId={slide._id}
                          selectedShapeId={selectedShapeId}
                          onClick={handleClickShape}
                          onBlur={clearSelectedShapeId}
                          onUpdateShape={handleUpdateShape}
                        />
                      );
                    })}
                  {/* {tempShape && <Shapes shape={tempShape} />} */}
                </div>
              </div>
            );
          })}
      </div>
      <Portal>
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
      </Portal>
    </Fragment>
  );
};

export default DocumentPage;
