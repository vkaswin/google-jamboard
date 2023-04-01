import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "@/hooks/useAuth";
import useTitle from "@/hooks/useTitle";
import Header from "./Header";
import ToolBar from "@/components/ToolBar";
import SketchBoard from "@/components/SketchBoard";
import Shapes, { InactiveShapes } from "@/components/Shapes";
import Slides from "@/components/Slides";
import TitlePopup from "@/components/TitlePopup";
import EditPopup from "@/components/EditPopup";
import { getDocumentById, updateDocument } from "@/services/Document";
import {
  clearSlide,
  createSlide,
  deleteSlide,
  updateSlide,
} from "@/services/Slide";
import { createShape, deleteShape, updateShape } from "@/services/Shape";
import { updateCanvas } from "@/services/Canvas";
import { getStaticUrl } from "@/utils";
import { shapes } from "@/constants";
import {
  BackGroundCode,
  DocumentDetail,
  ShapeDetail,
  NewShapeType,
  Colors,
} from "@/types/Document";

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

let defaultColors = {
  borderColor: "#262626",
  backgroundColor: "#FFFFFF",
} as const;

const DocumentPage = () => {
  let { user, logout } = useAuth();

  let [tool, setTool] = useState(2);

  let [shape, setShape] = useState(1);

  let [sketch, setSketch] = useState(0);

  let [sketchColor, setSketchColor] = useState(0);

  let [showEditPopup, setShowEditPopup] = useState(false);

  let [documentDetail, setDocumentDetail] = useState({} as DocumentDetail);

  let { slides, title } = documentDetail;

  let containerRef = useRef<HTMLDivElement | null>(null);

  let slideRef = useRef<HTMLElement | null>(null);

  let [activeSlide, setActiveSlide] = useState<number>(0);

  let [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  let [newShape, setNewShape] = useState<NewShapeType | null>(null);

  let [showTitle, setShowTitle] = useState(false);

  let [scale, setScale] = useState({ x: 1, y: 1 });

  let [colorOption, setColorOption] = useState<{
    borderColor: Colors;
    backgroundColor: Colors;
  }>(defaultColors);

  let mouseDownEvent = useRef({
    pageX: 0,
    pageY: 0,
  });

  let { documentId } = useParams();

  useTitle(title);

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
      `[data-slide='${activeSlideId}']`
    ) as HTMLElement;

    let miniSlideRef = document.querySelector(
      `[data-mini-slide='${activeSlideId}']`
    ) as HTMLElement;

    miniSlideRef.scrollIntoView({ behavior: "smooth", inline: "center" });
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

  useEffect(() => {
    if (!selectedShapeId) return;

    let selectedSlide = slides[activeSlide];
    let selectedShape = selectedSlide.shapes.find(
      ({ _id }) => _id === selectedShapeId
    );

    if (!selectedShape) return;

    setColorOption({
      borderColor: selectedShape.props.borderColor,
      backgroundColor: selectedShape.props.backgroundColor,
    });
  }, [selectedShapeId, slides, activeSlide]);

  let getDocumentDetail = async () => {
    if (!documentId) return;

    try {
      let {
        data: { data },
      } = await getDocumentById(documentId);
      setDocumentDetail(data);
    } catch (err: any) {
      toast.error(err?.message);
    }
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

  let handleClearSlide = async () => {
    if (!documentId || !activeSlideId) return;

    let slideIndex = activeSlide;
    try {
      await clearSlide(documentId, { slideId: activeSlideId });
      let canvasId = slides[slideIndex].canvas._id;

      let canvas = document.querySelector<HTMLCanvasElement>(
        `[data-canvas='${canvasId}']`
      );
      if (canvas) {
        let context = canvas.getContext("2d");
        if (context) {
          context.clearRect(
            0,
            0,
            canvasDimension.width,
            canvasDimension.height
          );
        }
      }

      let miniCanvas = document.querySelector<HTMLCanvasElement>(
        `[mini-canvas='${canvasId}']`
      );
      if (miniCanvas) {
        let context = miniCanvas.getContext("2d");
        if (context) {
          context.clearRect(
            0,
            0,
            canvasDimension.width,
            canvasDimension.height
          );
        }
      }

      let documentData = { ...documentDetail };
      let slide = documentData.slides[activeSlide];
      slide.shapes = [];
      slide.canvas.image = null;
      setDocumentDetail(documentData);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleUpdateCanvas = async (canvasId: string, blob: Blob) => {
    try {
      let slide = activeSlide;
      let formData = new FormData();
      formData.append("file", blob);
      await updateCanvas(canvasId, formData);
      let fileReader = new FileReader();
      fileReader.readAsDataURL(blob);
      fileReader.onloadend = () => {
        let base64 = fileReader.result;
        if (typeof base64 !== "string") return;
        let documentData = { ...documentDetail };
        documentData.slides[slide].canvas.image = base64.replace(
          "data:image/png;base64,",
          ""
        );
        setDocumentDetail(documentData);
      };
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleClickShape = (id: string) => {
    setSelectedShapeId(id);
  };

  let clearSelectedShapeId = () => {
    if (showEditPopup) return;
    setSelectedShapeId(null);
  };

  let handleDeleteShape = async () => {
    if (
      !documentId ||
      !activeSlideId ||
      !selectedShapeId ||
      !slides ||
      slides.length === 0
    )
      return;

    try {
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
    } catch (err: any) {
      toast.error(err?.message);
    }
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
      : tool === 4 || tool === 3
      ? "crosshair"
      : "default";
  }, [tool, sketchColor]);

  let slideBackGround = useMemo(() => {
    if (!slides || slides.length === 0) return;
    return slides[activeSlide].props.backgroundImage;
  }, [activeSlide, slides]);

  let selectedShape = useMemo(() => {
    if (!slides || slides.length === 0) return;
    let shape = slides[activeSlide].shapes.find(
      ({ _id }) => _id === selectedShapeId
    );
    return shape;
  }, [selectedShapeId]);

  let handleMouseDown = ({ pageX, pageY }: React.MouseEvent) => {
    if (!slideRef.current || !activeSlideId) return;

    let { width, height, left, top } = slideRef.current.getBoundingClientRect();
    let { clientWidth, clientHeight } = slideRef.current;

    let scaleX = clientWidth / width;
    let scaleY = clientHeight / height;

    let isStickyNote = tool === 3;
    let isTextBox = tool == 5;

    let shapeDetail: NewShapeType = {
      slideId: activeSlideId,
      shape: {
        type: isStickyNote
          ? "sticky-note"
          : isTextBox
          ? "text-box"
          : shapes[shape].type,
        props: {
          width: 1,
          height: 1,
          rotate: 0,
          translateX: (pageX - left) * scaleX,
          translateY: (pageY - top) * scaleY,
          borderColor: colorOption.borderColor,
          backgroundColor: colorOption.backgroundColor,
        },
      },
    };
    mouseDownEvent.current = {
      pageX,
      pageY,
    };
    setNewShape(shapeDetail);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  let handleMouseMove = ({ pageX, pageY }: MouseEvent) => {
    setNewShape((newShape) => {
      if (!newShape || !slideRef.current) return newShape;

      let { width, height, left, top } =
        slideRef.current.getBoundingClientRect();
      let { clientWidth, clientHeight } = slideRef.current;

      let scaleX = clientWidth / width;
      let scaleY = clientHeight / height;

      let shapeDetail = { ...newShape };
      let {
        shape: { props },
      } = shapeDetail;

      let x = pageX - mouseDownEvent.current.pageX;
      let y = pageY - mouseDownEvent.current.pageY;

      props.width = Math.abs(x) * scaleX;
      props.height = Math.abs(y) * scaleY;

      if (x < 0) {
        props.translateX =
          scaleX * (mouseDownEvent.current.pageX - left) - props.width;
      }
      if (y < 0) {
        props.translateY =
          scaleX * (mouseDownEvent.current.pageY - top) - props.height;
      }

      return shapeDetail;
    });
  };

  let handleMouseUp = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    setNewShape((newShape) => {
      if (newShape) handleAddShape(newShape.shape);
      return newShape;
    });
  };

  let handleUpdateShape = async (shape: Omit<ShapeDetail, "type">) => {
    try {
      let shapeIndex = slides[activeSlide].shapes.findIndex(
        ({ _id }) => _id === shape._id
      );

      if (shapeIndex === -1) return;

      await updateShape(shape._id, shape);
      let documentData = { ...documentDetail };
      documentData.slides[activeSlide].shapes[shapeIndex].props = shape.props;
      setDocumentDetail(documentData);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleAddShape = async (shape: NewShapeType["shape"]) => {
    if (!documentId || !activeSlideId) return;

    let body = {
      type: shape.type,
      props: shape.props,
    };

    try {
      let {
        data: { data },
      } = await createShape(documentId, { slideId: activeSlideId }, body);

      let documentData = { ...documentDetail };
      documentData.slides[activeSlide].shapes.push(data);
      setTool(2);
      setNewShape(null);
      setSelectedShapeId(data._id);
      setDocumentDetail(documentData);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleAddSlide = async (position: number) => {
    if (!documentId) return;

    try {
      let {
        data: { data },
      } = await createSlide(documentId, { position });
      setDocumentDetail(data);
      setActiveSlide(position);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleDeleteSlide = async (slideId: string) => {
    if (!documentId) return;

    try {
      let slideIndex = slides.findIndex(({ _id }) => _id === slideId);
      if (slideIndex === -1) return;
      await deleteSlide(documentId, { slideId });
      let documentData = { ...documentDetail };
      documentData.slides.splice(slideIndex, 1);
      setDocumentDetail(documentData);
      if (slideId === activeSlideId) setActiveSlide(0);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleUpdateTitle = async (title: string) => {
    if (!documentId) return;

    try {
      await updateDocument(documentId, { title });
      toggleTitle();
      setDocumentDetail({ ...documentDetail, title });
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let toggleTitle = () => {
    setShowTitle(!showTitle);
  };

  let handleUpdateBackGround = async (bgCode: BackGroundCode) => {
    if (!documentId || !activeSlideId) return;

    let slideIndex = activeSlide;

    try {
      await updateSlide(
        documentId,
        { slideId: activeSlideId },
        {
          backgroundImage: bgCode,
        }
      );
      let documentData = { ...documentDetail };
      documentData.slides[slideIndex].props = { backgroundImage: bgCode };
      setDocumentDetail(documentData);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleUpdateShapeColor = async (
    key: "backgroundColor" | "borderColor",
    colorCode: Colors
  ) => {
    if (!selectedShapeId) return;

    let slideIndex = activeSlide;

    try {
      let shapes = slides[activeSlide].shapes;
      let shapeIndex = shapes.findIndex(({ _id }) => _id === selectedShapeId);

      if (shapeIndex === -1) return;

      let shape = shapes[shapeIndex];

      if (shape.props[key] === colorCode) return;

      let body = { ...shape };
      body.props[key] = colorCode;
      await updateShape(selectedShapeId, body);
      let documentData = { ...documentDetail };
      documentData.slides[slideIndex].shapes[shapeIndex] = body;
      setDocumentDetail(documentData);
      setColorOption({ ...colorOption, [key]: colorCode });
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleUpdateStickyText = async (text: string) => {
    if (!selectedShapeId) return;

    let slideIndex = activeSlide;

    try {
      let shapeIndex = slides[activeSlide].shapes.findIndex(
        ({ _id }) => _id === selectedShapeId
      );
      if (shapeIndex === -1) return;
      let shape = slides[activeSlide].shapes[shapeIndex];
      shape.props.text = text;
      await updateShape(selectedShapeId, { props: shape.props });
      let documentData = { ...documentDetail };
      documentData.slides[slideIndex].shapes[shapeIndex].props.text = text;
      toggleEditPopup();
      setDocumentDetail(documentData);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let toggleEditPopup = () => {
    setShowEditPopup(!showEditPopup);
  };

  return (
    <Fragment>
      <Header
        user={user}
        title={title}
        logout={logout}
        toggleTitle={toggleTitle}
      >
        <Slides
          slides={slides}
          activeSlide={activeSlide}
          activeSlideId={activeSlideId}
          dimension={dimension}
          onSlideChange={setActiveSlide}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
        />
      </Header>
      <ToolBar
        tool={tool}
        shape={shape}
        sketch={sketch}
        sketchColor={sketchColor}
        slideBackGround={slideBackGround}
        borderColor={colorOption.borderColor}
        backgroundColor={colorOption.backgroundColor}
        selectedShapeId={selectedShapeId}
        onSelectTool={setTool}
        onSelectShape={setShape}
        onSelectSketch={setSketch}
        onClearSlide={handleClearSlide}
        onSelectSketchColor={setSketchColor}
        onSelectBackGround={handleUpdateBackGround}
        onSelectBorderColor={handleUpdateShapeColor}
        onSelectBackGroundColor={handleUpdateShapeColor}
      />
      <div ref={containerRef} className={styles.container}>
        {slides &&
          slides.length > 0 &&
          slides.map((slide) => {
            return (
              <div key={slide._id} className={styles.slide}>
                <div
                  data-slide={slide._id}
                  className={styles.board}
                  style={{
                    cursor,
                    width: dimension.width,
                    height: dimension.height,
                    transform: `scale(${scale.x},${scale.y}) translate(-50%, -50%)`,
                    backgroundImage: `url(${getStaticUrl(
                      `/background/${slide.props.backgroundImage}`
                    )}.png)`,
                  }}
                  {...([3, 4, 5].includes(tool) && {
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
                    isActiveSlide={slide._id === activeSlideId}
                  />
                  {slide.shapes &&
                    slide.shapes.map((shape) => {
                      return (
                        <Shapes
                          key={shape._id}
                          shape={shape}
                          selectedShapeId={selectedShapeId}
                          onClick={handleClickShape}
                          onBlur={clearSelectedShapeId}
                          onUpdateShape={handleUpdateShape}
                          onDeleteShape={handleDeleteShape}
                          {...(shape.type === "sticky-note" && {
                            onEditStickyNote: toggleEditPopup,
                          })}
                        />
                      );
                    })}
                  {newShape && newShape.slideId === slide._id && (
                    <InactiveShapes shape={newShape.shape} />
                  )}
                </div>
              </div>
            );
          })}
      </div>
      <TitlePopup
        title={title}
        isOpen={showTitle}
        toggle={toggleTitle}
        onSubmit={handleUpdateTitle}
      />
      <EditPopup
        isOpen={showEditPopup}
        text={selectedShape?.props.text}
        toggle={toggleEditPopup}
        onSubmit={handleUpdateStickyText}
      />
    </Fragment>
  );
};

export default DocumentPage;
