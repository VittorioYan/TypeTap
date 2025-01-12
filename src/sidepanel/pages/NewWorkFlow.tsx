"use client"

import { createThread } from "@/ai/service"
import { MessagePanel, WorkflowStatusType } from "@/components/Message"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Toaster } from "@/components/ui/toaster"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Welcome } from "@/components/Welcome"
import { templates } from "@/constant/templates"
import { type FileToBackend } from "@/global/types"
import { useToast } from "@/hooks/use-toast"
import { PlusOutlined } from "@ant-design/icons"
import { StoredMessage } from "@langchain/core/messages"
import { Image, Upload } from "antd"
import type { GetProp, UploadFile, UploadProps } from "antd"
import {
  AlertCircle,
  BadgePlus,
  CirclePause,
  Image as IMGICON,
  Send
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { sendToBackground } from "@plasmohq/messaging"
import { usePort } from "@plasmohq/messaging/hook"

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

async function getBase64List(fileList: UploadFile[]): Promise<FileToBackend[]> {
  const base64Array: FileToBackend[] = []

  // 使用 for...of 来保证顺序
  for (const file of fileList) {
    const base64 = await getBase64(file.originFileObj) // 等待每个文件的 base64 编码
    base64Array.push({
      fileName: file.name,
      fileContentBase64: base64,
      fileType: file.type
    })
  }

  return base64Array
}

const calculateTokenUsed = (messages: StoredMessage[]): number => {
  let tokenUsed: number = 0
  if (messages) {
    for (const message of messages) {
      if (message.type === "ai") {
        tokenUsed += message.data.response_metadata.usage?.total_tokens
      }
    }
  }

  return tokenUsed
}
type ErrorMessage = {
  error: string
}

export default () => {
  const uploadImageRef = useRef()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { toast } = useToast()
  const [threadId, setThreadId] = useState<string>()
  // const [messages, setMessages] = useState<Message[]>([])
  const workflowPort = usePort<any, StoredMessage[] | ErrorMessage>("workflow")
  const [inputMessage, setInputMessage] = useState("")
  const [startPage, setStartPage] = useState("")
  const [currentMessages, setCurrentMessages] = useState<StoredMessage[]>([])
  const [errorMessage, setErrorMessage] = useState<string>(null)
  const [tokenUsed, setTokenUsed] = useState(0)
  const [workflowStatus, setWorkflowStatus] =
    useState<WorkflowStatusType>("idle")

  const isWorkflowRunning = (): boolean => {
    return (
      currentMessages.length > 0 &&
      currentMessages?.at(currentMessages.length - 1)?.data.response_metadata
        ?.finish_reason !== "stop" &&
      errorMessage === null
    )
  }
  useEffect(() => {
    if (errorMessage !== null) {
      setWorkflowStatus("error")
    }
  }, [errorMessage])
  useEffect(() => {
    if (workflowPort.data) {
      if ("error" in workflowPort.data) {
        setErrorMessage(workflowPort.data.error)
      } else {
        setCurrentMessages(workflowPort.data)
      }
    }
  }, [workflowPort.data])

  useEffect(() => {
    setTokenUsed(calculateTokenUsed(currentMessages))
    setWorkflowStatus(
      isWorkflowRunning()
        ? "running"
        : workflowStatus === "running"
          ? "idle"
          : workflowStatus
    )
  }, [currentMessages])

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    setThreadId(createThread())
    setErrorMessage(null)
    setStartPage("")
    setCurrentMessages([])
    setTokenUsed(0)
    setWorkflowStatus("idle")
  }
  function getCurrentTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          resolve(tabs[0]) // 返回第一个活动标签
        } else {
          reject(new Error("未找到活动标签页"))
        }
      })
    })
  }
  function arePathsEqual(path1: string, path2: string): boolean {
    try {
      const url1 = new URL(path1)
      const url2 = new URL(path2)
      return url1.href === url2.href
    } catch (error) {
      console.error("无效路径:", error)
      return false
    }
  }
  function openTabAndWait(url: string) {
    return new Promise((resolve, reject) => {
      chrome.tabs.create({ url, active: true }, (tab) => {
        if (chrome.runtime.lastError) {
          reject(
            new Error("Failed to open tab: " + chrome.runtime.lastError.message)
          )
          return
        }

        // 监听标签页更新事件
        const listener = (tabId, changeInfo, updatedTab) => {
          if (tabId === tab.id && changeInfo.status === "complete") {
            // 页面加载完成，移除监听器并返回标签页信息
            chrome.tabs.onUpdated.removeListener(listener)
            resolve(updatedTab)
          }
        }

        chrome.tabs.onUpdated.addListener(listener)
      })
    })
  }

  const handleStartWorkflow = async (
    startPage: string,
    prompt: string,
    fileList: UploadFile[] = [],
    _threadId = threadId
  ) => {
    const currentTab = await getCurrentTab()
    console.log("🚀 ~ handleStartWorkflow ~ fileList:", fileList)
    if (startPage != "" && !arePathsEqual(startPage, currentTab.url)) {
      setWorkflowStatus("opentab")
      await openTabAndWait(startPage)
    }
    setWorkflowStatus("running")

    let fileListBase64: FileToBackend[] = []
    if (fileList.length > 0) {
      fileListBase64 = await getBase64List(fileList)
    }

    console.log("🚀 ~ handleStartWorkflow ~ currentTab:", currentTab)
    try {
      // TODO:处理流式返回
      workflowPort.send({
        prompt,
        threadId,
        fileListBase64
      })
    } catch (error) {
      setErrorMessage(`Error in conversation:${error}`)
    }
  }

  const onSubmit = async () => {
    // const _startPage = startPage
    // const _inputMessage = inputMessage
    handleStartWorkflow(startPage, inputMessage, fileList)
    setErrorMessage(null)
    setInputMessage("")
    setStartPage("")
    setFileList([])

    // await handleStartWorkflow(_startPage, _inputMessage)
  }
  const onSelectTemplate = (templateName: string) => {
    const template = templates.find((t) => t.name === templateName)
    setInputMessage(template.prompt)
    setStartPage(template.startPage)
  }
  // 在扩展页面的相关组件或工具函数中

  // 使用示例：
  // 在扩展页面的组件中
  const handleStopWorkflow = async () => {
    const stopWorkflow = async (threadId: string): Promise<void> => {
      const response = await sendToBackground({
        name: "stop-workflow",
        body: { threadId }
      })
      if (response.status === "success") {
        console.log("Workflow stopped successfully")
        setWorkflowStatus("stopped")
      } else {
        console.error("Failed to stop workflow:", response.message)
        toast({
          description: `停止失败。${response.message}`,
          variant: "destructive"
        })
      }
      return response
    }

    try {
      await stopWorkflow(threadId)

      // 处理停止后的 UI 更新
    } catch (error) {
      // 处理错误
      console.error("Failed to stop workflow:", error)
    }
  }
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }
  const hanldeUploadImage = async (file: UploadFile) => {}

  // TODO:增加参数的校验
  return (
    <TooltipProvider>
      <div className="flex flex-col h-full w-full border rounded-lg overflow-hidden">
        <div className="p-2 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold ">TypeTap</h2>
          {process.env.PLASMO_PUBLIC_DEBUG_MODE === "true" && (
            <Link to={"/test"}>Test Page</Link>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={init} size="icon" variant="ghost">
                <BadgePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>新会话</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex-grow overflow-y-scroll no-scrollbar w-full">
          {workflowStatus === "idle" && currentMessages.length === 0 && (
            <div>
              <Welcome quickFunc={handleStartWorkflow} />
            </div>
          )}

          <MessagePanel
            messages={currentMessages}
            workflowStatus={workflowStatus}
          />

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage("")
              }}
              src={previewImage}
            />
          )}
        </div>
        {workflowStatus === "error" && (
          <div className="m-4 justify-center">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </div>
        )}
        {workflowStatus === "stopped" && (
          <div className="m-4 justify-center">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>
                操作已中止，请点击右上角重新开始工作流
              </AlertDescription>
            </Alert>
          </div>
        )}
        {workflowStatus === "idle" && (
          <Upload
            className="m-4"
            fileList={fileList}
            multiple={true}
            onPreview={handlePreview}
            listType="picture-circle"
            onChange={({ file, fileList, event }) => {
              setFileList(fileList)
            }}>
            <Button disabled={workflowStatus !== "idle"} type="button">
              <IMGICON className="h-4 w-4" />
              <span className="sr-only">Upload Image</span>
            </Button>
          </Upload>
        )}

        {tokenUsed !== 0 && (
          <div className="flex  mb-2 ">
            <Badge
              className=" ml-4 max-w-[50%] w-fit "
              variant="secondary">{`使用token数:${tokenUsed}`}</Badge>
            <div className=" ml-4 max-w-[50%] w-fit ">
              <Badge onClick={() => handleStartWorkflow("", "继续")}>
                继续
              </Badge>
            </div>
          </div>
        )}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                placeholder="输入起始页面地址，http或https开头，为空表示使用当前标签页"
                className="flex-grow"
              />
              <Select onValueChange={onSelectTemplate}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="模板" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem value={template.name} key={template.name}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="输入你的任务目标"
                className="flex-grow"
              />
              {workflowStatus === "running" ? (
                <Button size="icon" type="button" onClick={handleStopWorkflow}>
                  <CirclePause className="h-4 w-4" />
                  <span className="sr-only">Stop</span>
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={inputMessage === "" || workflowStatus !== "idle"}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}
