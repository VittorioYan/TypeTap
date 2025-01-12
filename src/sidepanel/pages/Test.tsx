import { graph } from "@/ai/rpa-graph"
import { clickTool, inputTool } from "@/ai/tools"
import type { ScrapedPage } from "@/contents/utils/page-builder"
import { buildElementString } from "@/contents/utils/page-builder"
import ChatInterface from "@/sidepanel/pages/NewWorkFlow"
import { HumanMessage } from "@langchain/core/messages"
import { useEffect, useState } from "react"

import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"

import "@/style.css"

import { createThread } from "@/ai/service"
import { delay, getChromeStatus, getPageScrapeString } from "@/utils"
import { Upload, UploadFile } from "antd"

import { usePort } from "@plasmohq/messaging/hook"

// 将文件内容转换为 Base64 字符串的辅助函数
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(",")[1]) // 去掉 "data:application/octet-stream;base64,"
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function IndexPopup() {
  // const app = createWorkflowAgent()
  const [selector, setSelector] = useState("找一下搜索框")

  const [scrapePage, setScrapePage] = useState<ScrapedPage>()
  const [testResult, setTestResult] = useState("")
  const [graphImg, setGraphImg] = useState("")
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [openCount] = useStorage<number>("open-count", (storedCount) =>
    typeof storedCount === "undefined" ? 0 : storedCount + 1
  )

  const [checked, setChecked] = useStorage("checked", true)
  const [serialNumber, setSerialNumber] = useStorage("serial-number", "8427")

  useEffect(() => {
    testGetGraph()
  }, [])
  const testClick = async () => {
    const result = await clickTool.invoke({
      elementID: selector,
      purpose: "province"
    })
    setTestResult(JSON.stringify(result))
  }
  const testInput = async () => {
    const result = await inputTool.invoke({
      elementID: selector,
      text: "2024-09-20",
      purpose: "province"
    })
    setTestResult(JSON.stringify(result))
  }
  const testSelect = async () => {
    const result = await inputTool.invoke({
      elementID: selector,
      text: "湖北",
      purpose: "province"
    })
    setTestResult(JSON.stringify(result))
  }
  const testScreenshot = async () => {
    // const result = await await sendToContentScript({
    //   name: "get-web-screenshot"
    // })
    chrome.tabs.captureVisibleTab((dataUrl) => setTestResult(dataUrl))
    // setTestResult(JSON.stringify(result))
  }
  const testGetGraph = async () => {
    console.log("🚀 ~ testGetGraph ~ testGetGraph:")
    const result = await sendToBackground({
      name: "test-get-graph"
    })
    console.log("🚀 ~ testGetGraph ~ result:", result)
    // const blob = new Blob([result], {
    //   type: "image/jpeg"
    // })
    // console.log("🚀 ~ testGetGraph ~ blob:", blob)
    // const objectURL = URL.createObjectURL(blob)
    // console.log("🚀 ~ testGetGraph ~ objectURL:", objectURL)
    setGraphImg(result)
  }

  const testFindElement = async () => {
    for await (const chunk of await graph.stream(
      {
        messages: [new HumanMessage(selector)]
      },
      { configurable: { thread_id: createThread() }, streamMode: "values" }
    )) {
      console.log("🚀 ~ handleSendMessage ~ chunk:", chunk)
    }
  }
  const testSelectElement = async () => {
    for await (const chunk of await graph.stream({
      messages: [new HumanMessage(selector)]
    })) {
      console.log("🚀 ~ handleSendMessage ~ chunk:", chunk)
    }
    const result = sendToContentScript({
      name: "select-element"
    })
    setTestResult(JSON.stringify(result))
  }
  const testStopElement = async () => {
    const result = await sendToContentScript({
      name: "stop-select"
    })
    setTestResult(JSON.stringify(result))
  }

  const testGetChromeStatus = async () => {
    setTestResult(await getChromeStatus())
  }
  const testUploadFile = async () => {
    // 将文件内容转换为 Base64 字符串
    const fileContentBase64 = await convertFileToBase64(
      fileList[0].originFileObj
    )

    const result = await sendToContentScript({
      name: "upload-file",
      body: {
        elementID: selector,
        fileName: fileList[0].name,
        fileContent: fileContentBase64, // 传递 Base64 编码的文件内容
        fileType: fileList[0].type
      }
    })

    setTestResult(JSON.stringify(result))
  }

  const port = usePort("workflow")

  return (
    <div>
      <Input value={selector} onChange={(e) => setSelector(e.target.value)} />
      <Button onClick={testClick}>测试点击按钮</Button>
      <Button onClick={testFindElement}>测试寻找元素</Button>
      <Button onClick={testInput}>测试输入文字</Button>
      <Button onClick={testUploadFile}>测试上传文件</Button>
      <div>{JSON.stringify(fileList)}</div>
      <Upload
        className="m-4"
        fileList={fileList}
        listType="picture-circle"
        onChange={({ file, fileList, event }) => {
          setFileList(fileList)
        }}>
        <Button type="button">
          <span className="sr-only">Upload Image</span>
        </Button>
      </Upload>
      <Button onClick={testSelect}>测试改变option</Button>
      <div>{testResult}</div>
      <Button onClick={testSelectElement}>testSelectElement</Button>
      <Button onClick={testStopElement}>testStopElement</Button>
      <Button
        onClick={() => port.send({ prompt: "搜索123", threadId: "test" })}>
        testPort
      </Button>
      <Button onClick={testGetGraph}>获取图</Button>
      <Button onClick={testGetChromeStatus}>获取全部tab信息</Button>
      <div>{JSON.stringify(port.data)}</div>

      <Button
        onClick={async () => {
          setScrapePage(
            await sendToContentScript({
              name: "get-web-content"
            })
          )
        }}>
        获取页面
      </Button>
      <Button onClick={testScreenshot}>测试截图</Button>

      <img src={graphImg} className="w-full" />
      <img src={testResult} className="w-full" />
      <p>{JSON.stringify(scrapePage?.elementTree)}</p>
      {/*       
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16,
          width: 300
        }}>
        <p>Times opened: {openCount}</p>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <input
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
        {serialNumber}
      </div> */}
    </div>
  )
}

export default IndexPopup
