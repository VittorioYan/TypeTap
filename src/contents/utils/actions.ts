import {
  buildTreeFromBody,
  buildTreeRecursion
} from "@/contents/utils/domUtils"
import type { ScrapedPage } from "@/contents/utils/page-builder"
import {
  buildElementDict,
  trimElementTree
} from "@/contents/utils/page-builder"
import findSelector from "@/lib/findSelector"
import { delay } from "@/utils"
import FuzzySet from "fuzzyset"
import { diff } from "json-diff-ts"

import { highlightElement } from "./highlight"

export const buildScrapedPage = (): ScrapedPage => {
  let [elements, elementTree] = buildTreeFromBody()
  buildTreeRecursion(window.frames, elements, elementTree)
  let [idToCssDict, idToElementDict, idToFrameDict] = buildElementDict(elements)

  return {
    elements,
    idToCssDict,
    idToElementDict,
    idToFrameDict,
    elementTree,
    elementTreeTrimmed: trimElementTree(elementTree),
    url: window.location.href,
    html: document.documentElement.outerHTML
  }
}

function waitForDOMContentLoaded() {
  if (
    document.readyState === "interactive" ||
    document.readyState === "complete"
  ) {
    return // 页面已经解析完成
  }
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", resolve)
  })
}

enum ActionType {
  CLICK,
  INPUT,
  SELECT,
  SUBMIT,
  HOVER,
  SCROLL,
  WAIT,
  SWITCH_FRAME,
  SWITCH_WINDOW,
  SWITCH_TAB,
  SWITCH_TAB_BACK,
  SWITCH_TAB_FORWARD,
  SWITCH_TAB_LAST
}

class Action {
  elementID: string
  actionType: ActionType
}
const TEXT_PRESS_MAX_LENGTH = 1000 // 假设有最大长度限制
const TEXT_INPUT_DELAY = 50 // 每次输入字符的延迟时间
type InputElement = HTMLInputElement | HTMLTextAreaElement

class InputManager {
  // constructor(selector) {
  //   this.element = document.querySelector(selector);
  // }
  element: InputElement
  constructor(element: InputElement) {
    this.element = element
  }
  selectAutocompleteOption() {
    console.log(
      "🚀 ~ InputManager ~ selectAutocompleteOption ~ selectAutocompleteOption:"
    )

    const arrowDownEvent = new KeyboardEvent("keydown", { key: "ArrowDown" })
    this.element.dispatchEvent(arrowDownEvent)

    const enterEvent = new KeyboardEvent("keydown", { key: "Enter" })
    this.element.dispatchEvent(enterEvent)
  }

  async clear() {
    this.element.value = ""
  }

  async inputSequentially(text) {
    this.element.click()
    this.element.focus()
    await new Promise((resolve) => setTimeout(resolve, TEXT_INPUT_DELAY))
    const chars = text.split("")

    // 确保不会超过最大长度限制
    for (let i = 0; i < Math.min(chars.length, TEXT_PRESS_MAX_LENGTH); i++) {
      await this.pressKey(chars[i])
    }
    // await this.pressKey('Enter');
    this.selectAutocompleteOption()
    this.element.blur()
    // if (this.element.value !== text) {
    //   this.element.value = text
    // }
  }

  async pressKey(char) {
    // 创建并派发一个 'keydown' 事件
    this.element.value += char
    const keyDownEvent = new KeyboardEvent("keydown", { key: char })
    this.element.dispatchEvent(keyDownEvent)

    // 模拟输入字符
    const keyPressEvent = new KeyboardEvent("keypress", { key: char })
    this.element.dispatchEvent(keyPressEvent)

    // 派发 'keyup' 事件表示按键结束
    const keyUpEvent = new KeyboardEvent("keyup", { key: char })
    this.element.dispatchEvent(keyUpEvent)

    // 触发 'input' 事件
    const inputEvent = new Event("input", { bubbles: true })
    this.element.dispatchEvent(inputEvent)

    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, TEXT_INPUT_DELAY))
  }
}

function getDocumentElement(elementID: string, scrapedPage: ScrapedPage) {
  const frame = scrapedPage.idToFrameDict[elementID]

  let iframeDocument = document
  if (frame !== "main.frame") {
    const elementFrame: HTMLIFrameElement = document.querySelector(
      '[unique_id="' + frame + '"]'
    )
    iframeDocument =
      elementFrame.contentDocument || elementFrame.contentWindow.document
    // elementFrame.onload = () => {
    //   iframeDocument =
    //     elementFrame.contentDocument || elementFrame.contentWindow.document
    // }
  }

  const element = iframeDocument.querySelector(`[unique_id="${elementID}"]`)

  return element
}

export function handleSelect(
  elementID: string,
  value: string,
  scrapedPage: ScrapedPage
) {
  const element = getDocumentElement(elementID, scrapedPage)
  if (element && element instanceof HTMLSelectElement) {
    element.value = value
  } else {
    throw new Error(`Element with id "${elementID}" is not an select element`)
  }
}
export async function handleInput(
  elementID: string,
  text: string,
  scrapedPage: ScrapedPage
) {
  const spElement = scrapedPage.idToElementDict[elementID]
  // TODO:Selector Not Ready
  // const selector = await handleGetSelector(elementID, scrapedPage)
  console.log("🚀 ~ handleInput ~ spElement:", spElement)
  if (spElement.isSelectable) {
    const optionSet = FuzzySet()
    spElement.options.map((o) => optionSet.add(o.text))
    const match = optionSet.get(text)
    if (match.length > 0 && match[0][0] > 0.9) {
      handleSelect(elementID, match[0][1], scrapedPage)
    }
    // if (spElement.options?.some(o=>o.text === text)){
    //   handleSelect(elementID,text,scrapedPage)
    // }
    else {
      throw new Error(
        `Option "${text}" not found in select element with id "${elementID}"`
      )
    }
  } else {
    const inputArea = getDocumentElement(elementID, scrapedPage)
    if (inputArea) {
      const inputManager = new InputManager(inputArea as InputElement)
      await inputManager.clear()
      await inputManager.inputSequentially(text)
    } else {
      throw new Error(`Element with id "${elementID}" is not an input element`)
    }
  }
  await waitForDOMContentLoaded()

  return
}
function getElementCenter(element: Element) {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  return { x: centerX, y: centerY }
}

async function simulateClick(element: Element) {
  const center = getElementCenter(element)

  console.log("🚀 ~ simulateClick ~ center:", center)
  if (element instanceof HTMLElement) {
    element.focus()
  }
  const mouseMoveDownEvent = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    clientX: center.x,
    clientY: center.y
  })
  const mouseMoveUpEvent = new MouseEvent("mouseup", {
    bubbles: true,
    cancelable: true,
    clientX: center.x,
    clientY: center.y
  })
  element.dispatchEvent(mouseMoveDownEvent)
  await delay(100)
  element.dispatchEvent(mouseMoveUpEvent)
  // const clickEvent = new MouseEvent("click", {
  //   bubbles: true,
  //   cancelable: true,
  //   clientX: center.x,
  //   clientY: center.y
  // })
  // element.dispatchEvent(clickEvent)
}
function simulateClickElement(element: HTMLElement) {
  const eventOpts = { bubbles: true, view: window }

  element.dispatchEvent(new MouseEvent("mousedown", eventOpts))
  element.dispatchEvent(new MouseEvent("mouseup", eventOpts))
  console.log("🚀 ~ simulateClickElement ~ element:", element)

  if (element.click) {
    element.click()
    if (element.tagName.toLowerCase() === "a") {
      const href = element.getAttribute("href")
      if (href.toLowerCase().startsWith("javascript:")) {
        throw new Error(`ERROR-CSP:尝试点击，但是可能会有CSP问题导致无法成功`)
      }
    }
  } else {
    // simulateClick(element)
    element.dispatchEvent(new PointerEvent("click", { bubbles: true }))
  }

  element.focus?.()
}

export async function handleClick(elementID: string, scrapedPage: ScrapedPage) {
  const element = getDocumentElement(elementID, scrapedPage)
  // await simulateClick(element)
  simulateClickElement(element as HTMLElement)
  console.log("🚀 ~ handleClick ~ waitForDOMContentLoaded: BEGIN")
  await waitForDOMContentLoaded()
  console.log("🚀 ~ handleClick ~ waitForDOMContentLoaded: END")
  return
}

export async function handleGetSelector(
  elementID: string,
  scrapedPage: ScrapedPage
) {
  const element = getDocumentElement(elementID, scrapedPage)
  if (element) {
    return findSelector(element)
  } else {
    throw new Error(`Can't find element with id "${elementID}"`)
  }
}

export async function handleUploadFile(
  elementID: string,
  file: File,
  scrapedPage: ScrapedPage
) {
  function findFileInput(parentElement: HTMLElement): HTMLInputElement | null {
    // 查找当前元素下的 input[type="file"]
    const fileInputInChild = parentElement.querySelector('input[type="file"]')
    if (fileInputInChild) {
      return fileInputInChild as HTMLInputElement
    }

    let sibling = parentElement.previousElementSibling // 查找上面的兄弟元素
    while (sibling) {
      if (sibling instanceof HTMLInputElement && sibling.type === "file") {
        return sibling
      }
      sibling = sibling.previousElementSibling // 继续查找更上面的兄弟元素
    }

    sibling = parentElement.nextElementSibling // 查找下面的兄弟元素
    while (sibling) {
      if (sibling instanceof HTMLInputElement && sibling.type === "file") {
        return sibling
      }
      sibling = sibling.nextElementSibling // 继续查找更下面的兄弟元素
    }

    return null
  }
  const element = getDocumentElement(elementID, scrapedPage)
  console.log("🚀 ~ handleUploadFile ~ element:", element)
  let fileInput = null
  if (element instanceof HTMLInputElement && element.type === "file") {
    fileInput = element
  } else {
    fileInput = findFileInput(element as HTMLElement)
  }
  if (fileInput) {
    const dataTransfer = new DataTransfer()

    // 将文件添加到 DataTransfer 中
    dataTransfer.items.add(file)

    // 将 DataTransfer 中的文件列表赋给文件输入框
    fileInput.files = dataTransfer.files

    // 触发文件上传（如果有绑定 change 事件的监听器）
    fileInput.dispatchEvent(new Event("change"))
  } else {
    throw new Error(`Can't find input file element with id "${elementID}"`)
  }
}
