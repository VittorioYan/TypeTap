import { ModelSettingsSchema } from "@/components/ModelSetting"
import { type FileToBackend } from "@/global/types"
import { getChromeStatus } from "@/utils"
import { BaseMessage } from "@langchain/core/messages"
import { RunnableConfig } from "@langchain/core/runnables"
import { DynamicStructuredTool } from "@langchain/core/tools"
import { toolsCondition } from "@langchain/langgraph/prebuilt"
import { Annotation, MemorySaver, StateGraph } from "@langchain/langgraph/web"
import { ChatOpenAI } from "@langchain/openai"
import { z } from "zod"

import { Storage } from "@plasmohq/storage"

import {
  rpaImageMessagePromptTemplete,
  rpaMessagePromptTemplete,
  rpaSystemMessageTemplete
} from "./prompts"
import { SysDesc, systemsDesc } from "./sys-desc"
import { SyncToolNode } from "./tool-node"
import { clickTool, inputTool, uploadTool } from "./tools"

const storage = new Storage()

const findSysDesc = (url: string) => {
  const result = systemsDesc.find((sys: SysDesc) =>
    sys.url.includes(url)
  )?.description
  return result || ""
}

const DEBUG_MODE =
  process.env.PLASMO_PUBLIC_DEBUG_MODE?.toLowerCase() === "true"
//TODO:改用memory
const SUPPORT_IMAGE =
  process.env.PLASMO_PUBLIC_SUPPORT_IMAGE?.toLowerCase() === "true"
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y)
  }),
  files: Annotation<FileToBackend[]>({
    reducer: (x, y) => x.concat(y)
  }),
  tokenUsed: Annotation<number>({
    reducer: (x, y) => x + y
  })
})

const tools = [
  clickTool,
  inputTool,
  uploadTool
  // openUrlTool, chageTabTool
]

const toolNode = new SyncToolNode(tools)

const initModel = async (tools: DynamicStructuredTool[]) => {
  const modelWithoutTools = await initModelWithoutTools()
  return modelWithoutTools.bindTools(tools)
}

const initModelWithoutTools = async () => {
  const modelSettings: z.infer<typeof ModelSettingsSchema> =
    await storage.get("modelSettings")
  return new ChatOpenAI({
    model: modelSettings.model,
    apiKey: modelSettings.apiKey,
    streaming: true,
    temperature: 0,
    modelKwargs: {
      parallel_tool_calls: false
    },
    configuration: {
      baseURL: modelSettings.apiUrl
    },
    verbose: DEBUG_MODE
  })
}

async function callModel(
  state: typeof StateAnnotation.State,
  config: RunnableConfig
) {
  //TODO:修改这个每次创建的逻辑
  const beforeMessages = state.messages
  const model = await initModel(tools)

  const { statusString, url, screenshot } = await getChromeStatus()

  const fileList = state.files.map((item) => item.fileName)

  const systemDesc = findSysDesc(url)

  const systemMessage = await rpaSystemMessageTemplete.invoke({
    chromeStatus: statusString,
    fileList,
    systemDesc
  })
  let messages: any
  if (SUPPORT_IMAGE) {
    messages = await rpaImageMessagePromptTemplete.invoke({
      systemPrompt: systemMessage,
      message: beforeMessages,
      image_url: screenshot
    })
  } else {
    messages = await rpaMessagePromptTemplete.invoke({
      systemPrompt: systemMessage,
      message: beforeMessages
    })
  }
  console.log("🚀 ~ messages:", messages)

  const response = await model.invoke(messages, config)
  console.log("🚀 ~ response:", response)
  // We return a list, because this will get added to the existing list
  return { messages: [response] }
}

// Define a new graph
const workflow = new StateGraph(StateAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addConditionalEdges("agent", toolsCondition)
  .addEdge("tools", "agent")

// Initialize memory to persist state between graph runs
const checkpointer = new MemorySaver()

export const graph = workflow.compile({ checkpointer })
