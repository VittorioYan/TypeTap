// background/ports/workflow.ts
import { graph } from "@/ai/rpa-graph"
import { FileStorage } from "@/global/field"
import { type FileToBackend } from "@/global/types"
// import {graph} from "@/ai/resecher-graph"
import { delay } from "@/utils"
import {
  HumanMessage,
  mapChatMessagesToStoredMessages,
  StoredMessage
} from "@langchain/core/messages"

import { type PlasmoMessaging } from "@plasmohq/messaging"

const activeStreams = new Map<string, AbortController>()

type WorkflowPortReq = {
  prompt: string
  threadId: string
  fileListBase64: FileToBackend[]
}
let appOne = graph

const getApp = () => {
  if (!appOne) {
    appOne = graph
  }
  return appOne
}

export const rebuildApp = () => {
  appOne = null
}
const handler: PlasmoMessaging.PortHandler<
  WorkflowPortReq,
  StoredMessage[] | { error: string }
> = async (req, res) => {
  const app = getApp()
  console.log("workflow port req", req.body)
  const { prompt, threadId, fileListBase64 } = req.body
  console.log("fileListBase64", fileListBase64)

  // 如果已存在相同 threadId 的任务，先停止它
  if (activeStreams.has(threadId)) {
    // TODO:增加判断重复的逻辑
    return
  }

  const controller = new AbortController()
  activeStreams.set(threadId, controller)

  try {
    let messages: HumanMessage[] = []
    if (fileListBase64.length > 0) {
      for (const file of fileListBase64) {
        FileStorage[file.fileName] = file
        // await storege.set(`file-${file.fileName}`, file)
      }
      let content_img = []
      fileListBase64.forEach((file) => {
        content_img = content_img.concat([
          { type: "text", text: `fileName: ${file.fileName}` },
          { type: "image_url", image_url: { url: file.fileContentBase64 } }
        ])
      })
      messages = [
        new HumanMessage({
          content: [{ type: "text", text: prompt }, ...content_img]
        })
      ]
    } else {
      messages = [new HumanMessage(prompt)]
    }
    console.log("messages", messages)

    const graphStream = await app.stream(
      {
        messages,
        files: fileListBase64
      },
      {
        configurable: { thread_id: threadId },
        streamMode: "values",
        debug: false,
        signal: controller.signal,
        recursionLimit: 50,
        // TODO: 为发布稳定，暂时不加入 langfuseHandler
        // callbacks: [getLangfuseHandler()]
        callbacks: []
      }
    )
    console.log("🚀 ~ begin graph:")

    //TODO:Important!中断之后目前无法计费

    for await (const chunk of graphStream) {
      console.log("🚀 ~ forawait ~ chunk:", chunk)

      res.send(mapChatMessagesToStoredMessages(chunk.messages))
    }
  } catch (error) {
    if (error.message === "Aborted") {
      console.log("Stream aborted")
    } else {
      console.error("Error in workflow handler:", error)
      res.send({ error: error.message })
    }
  } finally {
    activeStreams.delete(threadId)
  }
}

export const cancelTask = async (threadId: string) => {
  const active = activeStreams.get(threadId)
  if (active) {
    active.abort()
    while (activeStreams.has(threadId)) {
      await delay(100)
    }

    return { status: "success" }
  } else {
    return {
      status: "fail",
      message: "No active stream found for the given thread ID."
    }
  }
}

export default handler
