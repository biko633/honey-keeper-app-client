export const clearContent = () => {
  const elements = document.getElementsByClassName("tiptap ProseMirror");
  for (let element of elements) {
    element.innerHTML = "";
  }
};
