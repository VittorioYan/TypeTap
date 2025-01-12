import nlp from 'compromise'
const RESERVED_ATTRIBUTES = new Set<string>([
  "accept", // for input file
  "alt",
  "aria-checked", // for option tag
  "aria-current",
  "aria-label",
  "aria-required",
  "aria-role",
  "aria-selected", // for option tag
  "checked",
  "data-original-title", // for bootstrap tooltip
  "data-ui",
  "for",
  "href", // for a tags
  "maxlength",
  "name",
  "pattern",
  "placeholder",
  "readonly",
  "required",
  "selected", // for option tag
  "src", // do we need this?
  "text-value",
  "title",
  "type",
  "value"
])

const BASE64_INCLUDE_ATTRIBUTES = new Set<string>([
  "href",
  "src",
  "poster",
  "srcset",
  "icon"
])
const ELEMENT_NODE_ATTRIBUTES = new Set<string>(["id"])

//TODO:Specifically, we merge function-descriptive web elements
// (e.g., StaticText [761] ‘My Account’) with interactive elements that share the same la-
// bel (e.g., link [1312] ‘My Account’)

export enum ElementTreeFormat {
  JSON = "json",
  HTML = "html"
}

export type ScrpayElement = {
  id: string
  frame: string
  interactable: boolean
  tagName: string
  attributes: Record<string, string>
  text: string
  children: ScrpayElement[]
  rect: DOMRect | null
  keepAllAttr: boolean
  isSelectable: boolean
  shadowHost?: string
  options?: Array<{ value: string; text: string; selected: boolean }>
}

export type ScrapedPage = {
  elements: ScrpayElement[]
  idToElementDict: Record<string, ScrpayElement>
  idToFrameDict: Record<string, string>
  idToCssDict: Record<string, string>
  elementTree: ScrpayElement[]
  elementTreeTrimmed: ScrpayElement[]
  url: string
  html: string
  extractedText?: string
}

export function buildElementString(
  page: ScrapedPage,
  fmt: ElementTreeFormat = ElementTreeFormat.JSON
): string {
  if (fmt === ElementTreeFormat.JSON) {
    return JSON.stringify(page.elementTreeTrimmed)
  }

  if (fmt === ElementTreeFormat.HTML) {
    return page.elementTreeTrimmed
      .map((element) => jsonToHtml(element))
      .join("")
  }
}

function jsonToHtml(element: Record<string, any>): string {
  // 深拷贝 attributes 对象
  const attributes = { ...element.attributes }

  // 将 node attribute 添加到 attributes
  for (const attr of ELEMENT_NODE_ATTRIBUTES) {
    const value = element[attr]
    if (value !== undefined && value !== null) {
      attributes[attr] = value
    }
  }

  // 构建 attributes 的 HTML 字符串
  const attributesHtml = Object.entries(attributes)
    .map(([key, value]) => buildAttribute(key, value))
    .join(" ")

  let tag = element.tagName
  if (element.isSelectable) {
    tag = "select"
  }

  const text = element.text || ""

  // 生成子元素的 HTML
  const childrenHtml = (element.children || [])
    .map((child: any) => jsonToHtml(child))
    .join("")

  // 生成 option 元素的 HTML
  const optionHtml = (element.options || [])
    .map(
      (option: any) =>
        `<option index="${option.optionIndex}">${option.text}</option>`
    )
    .join("")

  // 检查是否为自闭合标签
  if (
    ["img", "input", "br", "hr", "meta", "link"].includes(tag) &&
    !optionHtml &&
    !childrenHtml
  ) {
    return `<${tag}${attributesHtml ? " " + attributesHtml : ""}>`
  } else {
    return `<${tag}${attributesHtml ? " " + attributesHtml : ""}>${text}${childrenHtml}${optionHtml}</${tag}>`
  }
}

function buildAttribute(key: string, value: any): string {
  if (typeof value === "boolean" || typeof value === "number") {
    return `${key}="${String(value).toLowerCase()}"`
  }

  return value ? `${key}="${String(value)}"` : key
}
export function buildElementDict(
  elements: ScrpayElement[]
): [Record<string, string>, Record<string, ScrpayElement>, Record<string, string>] {
  const idToCssDict: Record<string, string> = {}
  const idToElementDict: Record<string, ScrpayElement> = {}
  const idToFrameDict: Record<string, string> = {}

  elements.forEach((element) => {
    const elementId: string = element.id || ""
    idToCssDict[elementId] = `[unique_id='${elementId}']`
    idToElementDict[elementId] = element
    idToFrameDict[elementId] = element.frame
  })

  return [idToCssDict, idToElementDict, idToFrameDict]
}


export function trimElementTree(elements: ScrpayElement[]): ScrpayElement[] {
  const queue: ScrpayElement[] = [...elements] // 创建队列

  while (queue.length > 0) {
    const queueEle = queue.shift() // 取出队列中的第一个元素

    if (!queueEle) continue // 如果元素为空则跳过

    if ("frame" in queueEle) {
      delete queueEle["frame"]
    }

    if ("id" in queueEle && !queueEle["interactable"]) {
      delete queueEle["id"]
    }

    if ("attributes" in queueEle) {
      const newAttributes = trimmedNonSemanticData(queueEle.attributes)
      if (newAttributes) {
        queueEle.attributes = newAttributes
      } else {
        delete queueEle["attributes"]
      }
    }

    if ("attributes" in queueEle && !queueEle["keepAllAttr"]) {
      const tagName = queueEle["tagName"] ? queueEle["tagName"] : ""
      const newAttributes = trimmedAttributes(tagName, queueEle.attributes)
      if (newAttributes) {
        queueEle["attributes"] = newAttributes
      } else {
        delete queueEle["attributes"]
      }
    }

    if ("keepAllAttr" in queueEle) {
      delete queueEle["keepAllAttr"]
    }

    if ("children" in queueEle) {
      queue.push(...queueEle["children"])
      if (queueEle["children"].length === 0) {
        delete queueEle["children"]
      }
    }

    if ("text" in queueEle) {
      const elementText = (queueEle["text"] as string).trim()
      if (!elementText) {
        delete queueEle["text"]
      }
    }
    if ("rect" in queueEle) {
      delete queueEle["rect"]
    }
  }

  return elements
}
function trimmedNonSemanticData(
  attributes: Record<string, string>
): Record<string, string> {
  const newAttributes: Record<string, string> = {}
  function isSemantic(s:string):boolean {
    let doc = nlp(s)
    if (/[\u4e00-\u9fa5]/.test(s)){
      return true
    }
    if (s.length>50 && !/\s/.test(s)){
      return false
    }
    if (s.length>50 && !doc.has("noun")){
        return false
      }
    return true
  }
  
  for (const key in attributes) {
    const value = attributes[key]
    if (
      BASE64_INCLUDE_ATTRIBUTES.has(key) &&
      value.includes("data:")
    ) {
      continue
    }
    if (! isSemantic(value)){
      continue
    }
    
    newAttributes[key] = value
  }
  return newAttributes
}
function trimmedBase64Data(
  attributes: Record<string, string>
): Record<string, string> {
  const newAttributes: Record<string, string> = {}

  for (const key in attributes) {
    if (
      BASE64_INCLUDE_ATTRIBUTES.has(key) &&
      attributes[key].includes("data:")
    ) {
      continue
    }
    newAttributes[key] = attributes[key]
  }

  return newAttributes
}

function trimmedAttributes(
  tagName: string,
  attributes: Record<string, string>
): Record<string, string> {
  const newAttributes: Record<string, string> = {}

  for (const key in attributes) {
    if (key === "id" && ["input", "textarea", "select"].includes(tagName)) {
      // 不删除这些元素的 id 属性，防止标签关联错误
      newAttributes[key] = attributes[key]
    }
    if (key === "role" && ["listbox", "option"].includes(attributes[key])) {
      newAttributes[key] = attributes[key]
    }
    if (RESERVED_ATTRIBUTES.has(key) && attributes[key]) {
      newAttributes[key] = attributes[key]
    }
  }

  return newAttributes
}
