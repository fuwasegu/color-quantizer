const imageInput = document.getElementById("imageInput");
const colorDepth = document.getElementById("colorDepth");
const depthValue = document.getElementById("depthValue");
const stepValue = document.getElementById("stepValue");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let originalImage = null;

imageInput.addEventListener("change", handleImageUpload);
colorDepth.addEventListener("input", updateImage);

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    updateImage();
  };
  img.src = URL.createObjectURL(file);
}

function updateImage() {
  if (!originalImage) return;

  const depth = parseInt(colorDepth.value);
  depthValue.textContent = depth;

  const step = 256 / depth;
  stepValue.textContent = Math.floor(step);

  const imageData = new ImageData(
    new Uint8ClampedArray(originalImage.data),
    originalImage.width,
    originalImage.height
  );
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.round(data[i] / step) * step);     // R
    data[i + 1] = Math.min(255, Math.round(data[i + 1] / step) * step); // G
    data[i + 2] = Math.min(255, Math.round(data[i + 2] / step) * step); // B
  }

  ctx.putImageData(imageData, 0, 0);
}
