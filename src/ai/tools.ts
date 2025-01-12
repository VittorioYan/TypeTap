import { time } from "console"
import { FileStorage } from "@/global/field"
import { FileToBackend } from "@/global/types"
import { delay, pingActiveTab } from "@/utils"
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search"
import { ToolMessage } from "@langchain/core/messages"
import { DynamicStructuredTool, tool } from "@langchain/core/tools"
import { diff } from "json-diff-ts"
import { retryAsync, wait } from "ts-retry"
import { z } from "zod"

// { color: "red" }

import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export type ToolExecResult = {
  status: "success" | "fail"
  message: string
}
type PageStatus = {
  url: string
  title: string
  id: number
  isWaiting: boolean
}

const DEBUG_MODE =
  process.env.PLASMO_PUBLIC_DEBUG_MODE?.toLowerCase() === "true"

const getActivePageStatus = async () => {
  return new Promise<PageStatus>((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError || tabs.length === 0) {
        reject(chrome.runtime.lastError || new Error("No active tab found"))
        return
      }
      const activeTab = tabs[0]

      // 检查页面的加载状态
      const isWaiting = activeTab.status === "loading"

      // 获取活动页面的信息
      const pageStatus = {
        url: activeTab.url,
        title: activeTab.title,
        id: activeTab.id,
        isWaiting: isWaiting
      }
      resolve(pageStatus)
    })
  })
}

function switchToTab(tabId: number) {
  return new Promise<ToolExecResult>((resolve, reject) => {
    chrome.tabs.update(tabId, { active: true }, (tab) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError || new Error("切换失败"))
      }
      resolve({ status: "success", message: "切换成功" })
    })
  })
}

function openNewTab(url: string) {
  return new Promise<ToolExecResult>((resolve, reject) => {
    chrome.tabs.create({ url }, (tab) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError || new Error("打开失败"))
      }
      resolve({ status: "success", message: "打开成功" })
    })
  })
}

export const clickTool = new DynamicStructuredTool({
  name: "clickTool",
  description: "点击目标元素",
  schema: z.object({
    elementID: z.string({
      description: "需要操作的element的unique_id,由四位字符组成，如jQaN"
    }),
    purpose: z.string({ description: "简要描述当前进行的操作内容和目标" })
  }),
  func: async ({
    elementID,
    purpose
  }: {
    elementID: string
    purpose: string
  }): Promise<ToolExecResult> => {
    console.log("🚀 ~ file: api.ts:89 ~ clickTool ~ elementId:", elementID)

    const beforePage = await sendToContentScript({
      name: "get-web-content"
    })
    console.log("🚀 ~ func: ~ beforePage:", beforePage)
    const result = await sendToContentScript({
      name: "click",
      body: {
        elementID
      }
    })
    if (!(result.status === "success")) {
      return result
    }
    await delay(2000)
    let afterPageStatus = await getActivePageStatus()
    console.log("🚀 ~ afterPageStatus:", afterPageStatus)
    let maxRetry = 5
    while (afterPageStatus.isWaiting && maxRetry > 0) {
      console.log("🚀 ~ maxRetry:", maxRetry)
      await delay(1000)
      afterPageStatus = await getActivePageStatus()
      maxRetry--
    }

    const afterPage = await retryAsync(
      async () =>
        await sendToContentScript({
          name: "get-web-content"
        }),
      { delay: 1000, maxTry: 5 }
    )
    console.log(new Date().toISOString())

    if (!afterPage) {
      throw new Error("页面加载超时，请检查页面是否加载完成")
    }
    if (afterPage.url === beforePage.url) {
      const pageDiff = diff(beforePage.elements, afterPage.elements, {
        embeddedObjKeys: { ".": "id" }
      })
      if (pageDiff.length == 0) {
        throw new Error("点击成功但是页面没有变化")
      }
    } else {
      return {
        status: "success",
        message: "页面跳转"
      }
    }
    return {
      status: "success",
      message: "点击成功"
    }
  },
  verbose: DEBUG_MODE
})

export const inputTool = new DynamicStructuredTool({
  name: "inputTool",
  description:
    "在输入框中输入内容，或者针对包含option的select元素选择。如果是select的情况，也可以尝试使用clickTool点击选择",
  schema: z.object({
    elementID: z.string({
      description: "需要操作的element的unique_id,由四位字符组成，如jQaN"
    }),
    text: z.string({ description: "需要输入的文本内容" }),
    purpose: z.string({ description: "简要描述当前进行的操作内容和目标" })
  }),
  func: async ({
    elementID,
    text,
    purpose
  }: {
    elementID: string
    text: string
    purpose: string
  }): Promise<ToolExecResult> => {
    console.log("🚀 ~ file: api.ts:89 ~ clickTool ~ elementId:", elementID)
    const result = await sendToContentScript({
      name: "input-text",
      body: {
        elementID,
        text
      }
    })
    return result
  },
  verbose: DEBUG_MODE
})

export const uploadTool = new DynamicStructuredTool({
  name: "uploadTool",
  description: "用于上传文件,需要选择对应的上传控件element",
  schema: z.object({
    elementID: z.string({
      description: "需要操作的element的unique_id,由四位字符组成，如jQaN"
    }),
    fileName: z.string({ description: "需要上传的文件" }),
    purpose: z.string({ description: "简要描述当前进行的操作内容和目标" })
  }),
  func: async ({
    elementID,
    fileName,
    purpose
  }: {
    elementID: string
    fileName: string
    purpose: string
  }): Promise<ToolExecResult> => {
    console.log("🚀 ~ file: api.ts:89 ~ uploadTool ~ elementId:", elementID)
    const fileTransfer: FileToBackend = FileStorage[fileName]
    const result = await sendToContentScript({
      name: "upload-file",
      body: {
        elementID,
        fileName,
        fileContent: fileTransfer.fileContentBase64,
        fileType: fileTransfer.fileType
      }
    })
    return result
  },
  verbose: DEBUG_MODE
})

export const buildTool = new DynamicStructuredTool({
  name: "buildTool",
  description:
    "如果用户的目标完成，必须调用这个工具。参考此次自动执行的历史步骤，构建出一套顺序执行的流程",
  schema: z.object({
    actions: z.array(
      z.object({
        name: z.string({ description: "操作名称" }),
        params: z.any({ description: "操作对应的参数" })
      })
    )
  }),
  func: async ({ actions }: { actions: any }) => {
    console.log("🚀 ~ func: ~ actions:", actions)
  }
  // verbose: DEBUG_MODE
})

export const findElementTool = new DynamicStructuredTool({
  name: "findElementTool",
  description: "用于在页面上查找满足某种条件的元素",
  schema: z.object({
    elementID: z.string({ description: "需要操作的element的unique_id" })
  }),
  func: async ({
    elementID
  }: {
    elementID: string
  }): Promise<ToolExecResult> => {
    console.log("🚀 ~ file: api.ts:89 ~ clickTool ~ elementId:", elementID)

    const result = await sendToContentScript({
      name: "get-element-selector",
      body: {
        elementID
      }
    })
    return result
    //   return await sendToContentScript({
    //     name: "click",
    //     body: {
    //       elementID
    //     }
    //   })
  }
  // verbose: DEBUG_MODE
})

export const noteTool = new DynamicStructuredTool({
  name: "noteTool",
  description: "用于记录重要信息",
  schema: z.object({
    note: z.string({
      description:
        "笔记内容，用于记录一些有助于完成用户目标，进行后续操作的笔记。你的记忆中不包含历史的状态，你需要将关键信息记录在笔记中供后续操作使用"
    }),

    purpose: z.string({ description: "简要描述当前进行的操作内容和目标" })
  }),
  func: async ({
    note,
    purpose
  }: {
    note: string
    purpose: string
  }): Promise<ToolExecResult> => {
    // let result: ToolExecResult
    const result: ToolExecResult = {
      status: "success",
      message: note
    }
    return result
  }
  // verbose: DEBUG_MODE
})

export const chageTabTool = new DynamicStructuredTool({
  name: "chageTabTool",
  description: "在active tab无法满足工作要求时，切换active tab 到其他的tab页面",
  schema: z.object({
    tabID: z.number({
      description:
        "切换到此TabID，如果当前就是这个tab则不用切换。这个ID必须是当前浏览器状态中已出现的"
    }),

    purpose: z.string({ description: "简要描述当前进行的操作内容和目标" })
  }),
  func: async ({
    tabID,

    purpose
  }: {
    tabID: number
    purpose: string
  }): Promise<ToolExecResult> => {
    let result: ToolExecResult
    if (!tabID) {
      return { status: "fail", message: "没有tabID，请检查参数" }
    }
    if (tabID) {
      try {
        result = await switchToTab(tabID)
      } catch (e) {
        return { status: "fail", message: "切换失败" }
      }
    }
    await pingActiveTab()
    return result
  }
  // verbose: DEBUG_MODE
})

export const openUrlTool = new DynamicStructuredTool({
  name: "openUrlTool",
  description:
    "打开目标页面，如果目标页面已经打开，则优先使用切换工具切换到目标页面",
  schema: z.object({
    url: z.string({
      description: "需要打开的页面url，不包含参数，只能有域名和路径"
    }),
    purpose: z.string({ description: "简要描述当前进行的操作内容和目标" })
  }),
  func: async ({
    url,
    purpose
  }: {
    url: string
    purpose: string
  }): Promise<ToolExecResult> => {
    let result: ToolExecResult
    if (!url) {
      return { status: "fail", message: "没有url，请检查参数" }
    }
    if (url) {
      try {
        result = await openNewTab(url)
      } catch (e) {
        return { status: "fail", message: "打开失败" }
      }
    }
    await pingActiveTab()

    return result
  }
  // verbose: DEBUG_MODE
})

export const testTool = new DynamicStructuredTool({
  name: "testTool",
  description: "测试工具",
  schema: z.object({
    elementID: z.string({ description: "需要操作的element的unique_id" })
  }),
  func: async ({
    elementID
  }: {
    elementID: string
  }): Promise<ToolExecResult> => {
    console.log("🚀 ~ file: api.ts:89 ~ clickTool ~ elementId:", elementID)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    return { status: "success", message: "测试成功" }
    //   return await sendToContentScript({
    //     name: "click",
    //     body: {
    //       elementID
    //     }
    //   })
  }
  // verbose: DEBUG_MODE
})

export const searchTool = new DynamicStructuredTool({
  name: "searchTool",
  description: "搜索工具，用于查询资料，规划工作",
  schema: z.object({
    input: z.string({ description: "搜索的关键词" }),
    purpose: z.string({ description: "简要描述当前进行的操作内容和目标" })
  }),
  func: async ({
    input,
    purpose
  }: {
    input: string
    purpose: string
  }): Promise<ToolExecResult> => {
    const duckSearch = new DuckDuckGoSearch({ maxResults: 1 })
    const result = await duckSearch.invoke(input)
    console.log("🚀 ~ result:", result)
    return { status: "success", message: result }
    //   return await sendToContentScript({
    //     name: "click",
    //     body: {
    //       elementID
    //     }
    //   })
  }
  // verbose: DEBUG_MODE
})
