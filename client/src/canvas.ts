import axios from "axios";

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
let isClicked = false;

let img = new Image();
img.src = "/download.png";
img.onload = function () {
  if (!ctx) return;
  let dot = ctx.createPattern(img, "repeat");
  if (!dot) return;
  ctx.fillStyle = dot;
  ctx.lineWidth = 2;
};

canvas.width = window.innerWidth - 20;
canvas.height = 400;
canvas.style.border = "1px solid black";

canvas.onmousedown = function ({ x, y }) {
  isClicked = true;
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
};

canvas.onmouseup = function () {
  isClicked = false;

  canvas.toBlob((data) => {
    if (!data) return;
    let formData = new FormData();
    formData.append("file", data);
    axios({
      url: "http://localhost:8000/api/image/64106505659e51ce8d788753/edit",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "put",
      data: formData,
    });
  }, "image/png");
};

canvas.onmousemove = function ({ x, y }) {
  requestAnimationFrame(function () {
    if (!isClicked || !ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  });
};

document.body.append(canvas);

axios({
  method: "get",
  url: "http://localhost:8000/api/document/64106505659e51ce8d788753/detail",
}).then(
  ({
    data: {
      data: { image },
    },
  }) => {
    let img = new Image();
    img.src = image;
    img.onload = () => {
      if (!ctx) return;
      ctx.drawImage(img, img.clientWidth, img.clientHeight);
    };
  }
);

export {};
