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
import Header from "@/components/Header";
import ToolBar from "@/components/ToolBar";
import SketchBoard from "@/components/SketchBoard";
import Shapes from "@/components/Shapes";
import DropDown from "@/components/DropDown";
import Slides from "@/components/Slides";
import { getDocumentById } from "@/services/Document";
import { clearSlide, createSlide, deleteSlide } from "@/services/Slide";
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

  let [newShape, setNewShape] = useState<{
    slideId: string;
    shape: ShapeDetail;
  } | null>(null);

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

    try {
      await clearSlide(documentId, { slideId: activeSlideId });
      let canvas = (
        document.querySelector(`[data-slide='${activeSlideId}']`) as HTMLElement
      ).querySelector("canvas") as HTMLCanvasElement;
      let context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvasDimension.width, canvasDimension.height);
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
    setSelectedShapeId(null);
  };

  let handleDuplicateShape = () => {
    if (!selectedShapeId) return;
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
      : tool === 4
      ? "crosshair"
      : "default";
  }, [tool, sketchColor]);

  let handleMouseMove = ({ pageX, pageY }: MouseEvent) => {
    setNewShape((newShape) => {
      if (!newShape || !slideRef.current) return newShape;

      let { width, height } = slideRef.current.getBoundingClientRect();
      let { clientWidth, clientHeight } = slideRef.current;

      let scaleX = clientWidth / width;
      let scaleY = clientHeight / height;

      let shapeDetail = { ...newShape };
      shapeDetail.shape.props.width =
        (pageX - mouseDownEvent.current.pageX) * scaleX;
      shapeDetail.shape.props.height =
        (pageY - mouseDownEvent.current.pageY) * scaleY;

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

  let handleAddShape = async (shape: ShapeDetail) => {
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
      setDocumentDetail(documentData);
      setSelectedShapeId(data._id);
      setNewShape(null);
      setTool(2);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  let handleMouseDown = ({ pageX, pageY }: React.MouseEvent) => {
    if (!slideRef.current || !activeSlideId) return;

    let { width, height, left, top } = slideRef.current.getBoundingClientRect();
    let { clientWidth, clientHeight } = slideRef.current;

    let scaleX = clientWidth / width;
    let scaleY = clientHeight / height;

    let isTextBox = tool == 5;

    let shapeDetail: { slideId: string; shape: ShapeDetail } = {
      slideId: activeSlideId,
      shape: {
        _id: crypto.randomUUID(),
        type: isTextBox ? "text-box" : shapes[shape].type,
        props: {
          width: isTextBox ? 250 : 1,
          height: isTextBox ? 150 : 1,
          rotate: 0,
          translateX: (pageX - left) * scaleX,
          translateY: (pageY - top) * scaleY,
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

  let handleAddSlide = async (position: number) => {
    if (!documentId) return;

    try {
      let {
        data: { data, message },
      } = await createSlide(documentId, { position });
      let documentData = { ...documentDetail };
      documentData.slides.splice(position, 0, data);
      setDocumentDetail(documentData);
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
      let {
        data: { message },
      } = await deleteSlide(documentId, { slideId });
      let documentData = { ...documentDetail };
      documentData.slides.splice(slideIndex, 1);
      setDocumentDetail(documentData);
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  return (
    <Fragment>
      <Header user={user} logout={logout} onClearSlide={handleClearSlide}>
        <Slides
          slides={slides}
          activeSlide={activeSlide}
          activeSlideId={activeSlideId}
          onSlideChange={setActiveSlide}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
          dimension={dimension}
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
                  data-slide={slide._id}
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
                          selectedShapeId={selectedShapeId}
                          onClick={handleClickShape}
                          onBlur={clearSelectedShapeId}
                          onUpdateShape={handleUpdateShape}
                        />
                      );
                    })}
                  {newShape && newShape.slideId === slide._id && (
                    <Shapes shape={newShape.shape} slideId={slide._id} />
                  )}
                </div>
              </div>
            );
          })}
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
