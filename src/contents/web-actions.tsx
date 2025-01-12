import {
  buildScrapedPage,
  handleClick,
  handleGetSelector,
  handleInput,
  handleUploadFile
} from "@/contents/utils/actions"
import { delay } from "@/utils"
import { diff, IChange } from "json-diff-ts"
import type { PlasmoCSConfig } from "plasmo"

import { useMessage } from "@plasmohq/messaging/hook"

import { cancelHighlightElement, highlightElement } from "./utils/highlight"
import type { ScrapedPage } from "./utils/page-builder"

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

export const config: PlasmoCSConfig = {
  // all_frames: true
}

let scrapedPage: ScrapedPage = null

type SimplifiedDiff = {
  path: string // 标识属性的完整路径
  action: "ADD" | "REMOVE" | "UPDATE" // 操作类型
  oldValue?: any // 原始值（仅 REMOVE 或 UPDATE 时存在）
  newValue?: any // 新值（仅 ADD 或 UPDATE 时存在）
}
// 转换函数
function transformDiff(rawDiff: IChange): SimplifiedDiff[] {
  const simplifiedDiffs: SimplifiedDiff[] = []

  function traverse(node: IChange, path: string[] = []) {
    // 构建当前节点的完整路径
    const currentPath = [...path, node.key].join(".")

    // 只处理最内层的变化
    if (!node.changes || node.changes.length === 0) {
      if (node.type === "ADD") {
        simplifiedDiffs.push({
          path: currentPath,
          action: "ADD",
          newValue: node.value
        })
      } else if (node.type === "REMOVE") {
        simplifiedDiffs.push({
          path: currentPath,
          action: "REMOVE",
          oldValue: node.oldValue
        })
      } else if (node.type === "UPDATE") {
        simplifiedDiffs.push({
          path: currentPath,
          action: "UPDATE",
          oldValue: node.oldValue,
          newValue: node.value
        })
      }
    } else {
      // 递归处理子变化
      for (const child of node.changes) {
        traverse(child, [...path, node.key])
      }
    }
  }

  // 从根节点开始遍历
  traverse(rawDiff)
  return simplifiedDiffs
}
const webActions = () => {
  const { data } = useMessage<string, any>(async (req: any, res) => {
    console.log("🚀 ~ const{data}=useMessage<string,string> ~ req:", req)
    if (req.name === "connect-test") {
      res.send({ status: "success" })
    }
    if (req.name === "get-element-selector") {
      scrapedPage = buildScrapedPage()
      const { elementID } = req.body
      const result = await handleGetSelector(elementID, scrapedPage)
      res.send(result)
    }

    if (req.name === "get-web-content") {
      scrapedPage = buildScrapedPage()
      res.send(scrapedPage)
    }
    if (req.name === "get-web-screenshot") {
      chrome.tabs.captureVisibleTab((dataUrl) => res.send(dataUrl))
    }

    if (req.name === "upload-file") {
      scrapedPage = buildScrapedPage()

      console.log(req.body)
      const { elementID, fileName, fileContent, fileType } = req.body
      console.log("fileContnet:", fileContent)
      // 将 Base64 字符串解码为二进制数据
      const binaryData = atob(fileContent.split(",")[1])
      const byteArrays = []
      for (let i = 0; i < binaryData.length; i++) {
        byteArrays.push(binaryData.charCodeAt(i))
      }
      const uint8Array = new Uint8Array(byteArrays)

      // 创建 Blob 对象
      const blob = new Blob([uint8Array], { type: fileType })

      const newFile = new File([blob], fileName, {
        type: fileType
      })

      const element = getDocumentElement(elementID, scrapedPage)
      try {
        highlightElement(element as HTMLElement)
        await handleUploadFile(elementID, newFile, scrapedPage)
        res.send({
          status: "success"
        })
      } catch (e) {
        console.log(e)
        res.send({ status: "fail", message: e.toString() })
      } finally {
        cancelHighlightElement(element as HTMLElement)
      }
    }

    if (req.name === "input-text") {
      scrapedPage = buildScrapedPage()

      console.log(req.body)
      const { elementID, text } = req.body
      // const frame = scrapedPage.idToFrameDict[elementID]
      const element = getDocumentElement(elementID, scrapedPage)
      try {
        console.log(
          "🚀 ~ const{data}=useMessage<string,any> ~ scrapedPage:",
          scrapedPage
        )

        highlightElement(element as HTMLElement)
        await delay(1000)
        const selector = await handleInput(elementID, text, scrapedPage)
        const newPage = buildScrapedPage()
        const pageDiff = diff(
          scrapedPage.idToElementDict,
          newPage.idToElementDict
        )
        console.log(
          "🚀 ~ const{data}=useMessage<string,any> ~ difff:",
          pageDiff
        )
        if (pageDiff.length === 0) {
          res.send({
            status: "fail",
            message: `成功点击，但是页面无变化`
          })
          return
        }
        const pageDiffTrimmed = transformDiff(pageDiff[0])

        console.log("diff:", JSON.stringify(pageDiffTrimmed).length)
        console.log("diff:", JSON.stringify(pageDiffTrimmed))
        // console.log("diff:", transformDiff(pageDiff))
        res.send({
          status: "success",
          message: `diff:${JSON.stringify(pageDiffTrimmed)}`
        })
      } catch (e) {
        console.log(e)
        res.send({ status: "fail", message: e })
      } finally {
        cancelHighlightElement(element as HTMLElement)
      }
    }

    if (req.name === "click") {
      scrapedPage = buildScrapedPage()
      console.log(
        "🚀 ~ const{data}=useMessage<string,any> ~ scrapedPage:",
        scrapedPage
      )
      const { elementID } = req.body
      const element = getDocumentElement(elementID, scrapedPage)
      // const frame = scrapedPage.idToFrameDict[elementID]
      try {
        highlightElement(element as HTMLElement)
        await delay(1000)
        const selector = await handleClick(elementID, scrapedPage)

        const newPage = buildScrapedPage()
        console.log(
          "🚀 ~ const{data}=useMessage<string,any> ~ newPage:",
          newPage
        )
        if (newPage.url !== scrapedPage.url) {
          console.log(
            "🚀 ~ const{data}=useMessage<string,any> ~ newPage.url !== scrapedPage.url:"
          )

          res.send({
            status: "success",
            message: `页面跳转`
          })
          return
        }
        const pageDiff = diff(
          scrapedPage.idToElementDict,
          newPage.idToElementDict
        )
        if (pageDiff.length === 0) {
          res.send({
            status: "fail",
            message: `成功点击，但是页面无变化`
          })
          return
        }
        const pageDiffTrimmed = transformDiff(pageDiff[0])
        // console.log("diff:", transformDiff(pageDiff))
        res.send({
          status: "success",
          message: `diff:${JSON.stringify(pageDiffTrimmed)}`
        })
      } catch (e) {
        res.send({ status: "fail", message: e.message })
      } finally {
        cancelHighlightElement(element as HTMLElement)
      }
    }
  })
}

export default webActions
