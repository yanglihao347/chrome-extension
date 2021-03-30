// const sideDiv = document.getElementById("sideDiv");

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log(message);
//   addList(message);
//   sendResponse("woshi");
// });

// document.onmouseup = (e) => {
//   let selectionText = window.getSelection().toString();
//   if (selectionText) {
//   }
// };

const handleMouseDown = (e) => {
  // e.preventDefault();
  if (e.target.type === "a") {
    window.dragInfo = {
      href: a.target.href,
      innerText: a.target.innerText,
    };
  }
  console.log(e);
  // let selectionText = window.getSelection().toString();
};

const handleClick = (e) => {
  e.preventDefault();
};

const handleMouseUp = (e) => {
  console.log("from document...");

  // window.dragInfo = null;
};

const sideMouseUp = (e) => {
  console.log("from sidebar...");
  // let selectionText = window.getSelection().toString();
  // if (selectionText) {
  //   addList({ selectionText });
  // }
  // window.getSelection().removeAllRanges();
};

document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("click", handleClick);
document.addEventListener("mouseup", handleMouseUp);
// sideDiv.addEventListener("mouseup", sideMouseUp);
