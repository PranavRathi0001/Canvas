const canvas = document.getElementById("canvas-area");
const addTextButton = document.getElementById("addText");
const boldButton = document.getElementById("bold");
const italicButton = document.getElementById("italic");
const underlineButton = document.getElementById("underline");
const clearCanvasButton = document.getElementById("clearCanvas");
const fontSizeSelect = document.getElementById("fontSize");
const fontFamilySelect = document.getElementById("fontFamily");
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");

let history = [];
let redoHistory = [];

function saveState() {
  history.push(canvas.innerHTML);
  redoHistory = []; // Clear redo history on new action
}

// Function to add a draggable text field to the canvas
addTextButton.addEventListener("click", () => {
  const textElement = document.createElement("div");
  textElement.contentEditable = true;
  textElement.textContent = "New Text";
  textElement.style.position = "absolute";
  textElement.style.left = "50px";
  textElement.style.top = "50px";
  textElement.style.fontSize = fontSizeSelect.value || "16px";
  textElement.style.fontFamily = fontFamilySelect.value || "Arial";
  textElement.style.cursor = "move";
  textElement.classList.add("draggable-text");

  // Add drag-and-drop functionality
  textElement.draggable = true;

  textElement.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", null); // Required for Firefox
    textElement.dataset.offsetX = e.offsetX;
    textElement.dataset.offsetY = e.offsetY;
  });

  textElement.addEventListener("dragend", (e) => {
    const offsetX = parseInt(textElement.dataset.offsetX, 10);
    const offsetY = parseInt(textElement.dataset.offsetY, 10);

    textElement.style.left = `${e.pageX - canvas.offsetLeft - offsetX}px`;
    textElement.style.top = `${e.pageY - canvas.offsetTop - offsetY}px`;

    saveState(); // Save the state after moving the text
  });

  canvas.appendChild(textElement);
  saveState();
});

// Undo functionality
undoButton.addEventListener("click", () => {
  if (history.length > 0) {
    redoHistory.push(history.pop());
    canvas.innerHTML = history[history.length - 1] || "";
    reinitializeDrag(); // Reinitialize drag-and-drop functionality
  }
});

// Redo functionality
redoButton.addEventListener("click", () => {
  if (redoHistory.length > 0) {
    history.push(redoHistory.pop());
    canvas.innerHTML = history[history.length - 1] || "";
    reinitializeDrag(); // Reinitialize drag-and-drop functionality
  }
});

// Clear the canvas
clearCanvasButton.addEventListener("click", () => {
  canvas.innerHTML = "";
  saveState();
});

// Bold text
boldButton.addEventListener("click", () => {
  document.execCommand("bold");
});

// Italic text
italicButton.addEventListener("click", () => {
  document.execCommand("italic");
});

// Underline text
underlineButton.addEventListener("click", () => {
  document.execCommand("underline");
});

// Change font size
fontSizeSelect.addEventListener("change", () => {
  document.execCommand("fontSize", false, "7");
  const fontElements = document.getElementsByTagName("font");
  for (let font of fontElements) {
    font.removeAttribute("size");
    font.style.fontSize = fontSizeSelect.value;
  }
});

// Change font family
fontFamilySelect.addEventListener("change", () => {
  document.execCommand("fontName", false, fontFamilySelect.value);
});

// Reinitialize drag-and-drop functionality for existing text elements
function reinitializeDrag() {
  const draggableTexts = document.querySelectorAll(".draggable-text");
  draggableTexts.forEach((textElement) => {
    textElement.draggable = true;

    textElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", null); // Required for Firefox
      textElement.dataset.offsetX = e.offsetX;
      textElement.dataset.offsetY = e.offsetY;
    });

    textElement.addEventListener("dragend", (e) => {
      const offsetX = parseInt(textElement.dataset.offsetX, 10);
      const offsetY = parseInt(textElement.dataset.offsetY, 10);

      textElement.style.left = `${e.pageX - canvas.offsetLeft - offsetX}px`;
      textElement.style.top = `${e.pageY - canvas.offsetTop - offsetY}px`;

      saveState();
    });
  });
}
