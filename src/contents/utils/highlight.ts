export const highlightElement = (element: HTMLElement) => {
  console.log("🚀 ~ highlightElement ~ element:")
  if (element) {
    element.classList.add("typeTap-highlight")
    element.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

export const cancelHighlightElement = (element: HTMLElement) => {
  if (element) element.classList.remove("typeTap-highlight")
}
