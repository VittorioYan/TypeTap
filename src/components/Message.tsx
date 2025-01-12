import { ToolExecResult } from "@/ai/tools"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { testMessage } from "@/test/testMessage"
import { ToolCall } from "@langchain/core/dist/messages/tool"
import {
  MessageContent,
  MessageContentComplex,
  StoredMessage
} from "@langchain/core/messages"
// import type { ChatInterface } from "../sidepanel/pages/NewWorkFlow"
import { Image, message } from "antd"
import { Bot, Speech, Wrench } from "lucide-react"
import markdownit from "markdown-it"
import { useEffect, useRef } from "react"

import { ScrollArea } from "./ui/scroll-area"
import { Spinner } from "./ui/spinner"

const md = markdownit({ html: true, breaks: true })
type MessageType = "human" | "ai" | "tool"
type ToolCallStatus = "process" | "completed" | "failed"
export type WorkflowStatusType =
  | "opentab"
  | "running"
  | "stopped"
  | "error"
  | "idle"

export type ChatInterface = {
  messageType: MessageType
  content: MessageContent
  toolCallId?: string
  toolCallStatus?: ToolCallStatus
  toolCallMessage?: string
  toolCall?: ToolCall
}

const convertMessagesToChatInterfaces = (
  messages: StoredMessage[]
): ChatInterface[] => {
  if (!messages) return []
  let result: ChatInterface[] = []

  for (const message of messages) {
    if (message.type === "human") {
      result.push({
        messageType: "human",
        content: message.data.content
      })
    } else if (message.type === "ai") {
      if (message.data.content !== "") {
        result.push({
          messageType: "ai",
          content: message.data.content
        })
      }
      if (message.data.additional_kwargs.tool_calls) {
        for (const toolCall of message.data.additional_kwargs.tool_calls) {
          const argument = JSON.parse(toolCall.function.arguments)

          result.push({
            messageType: "tool",
            content: argument.purpose,
            toolCallStatus: "process",
            toolCallId: toolCall.id,
            toolCall: toolCall
          })
        }
      }
    } else if (message.type === "tool") {
      const toolCallId = message.data.tool_call_id

      result.forEach((item) => {
        if (item.toolCallId === toolCallId) {
          try {
            const toolResult: ToolExecResult = JSON.parse(message.data.content)

            if (toolResult.status === "success") {
              item.toolCallStatus = "completed"
              item.toolCallMessage = toolResult.message
            } else {
              item.toolCallStatus = "failed"
              item.toolCallMessage = toolResult.message
            }
          } catch (e) {
            item.toolCallStatus = "failed"
            item.toolCallMessage = message.data.content
          }
          // finally {
          //   item.content += `(${item.toolCallStatus})`
          // }
        }
      })
    }
  }
  return result
}
// {
//   messageType==="human"?<div>
//     // human message
//   </div>:messageType==="tool"?<div>
//     // tool call
//   </div>:<div>
//     // ai message
//   </div>
// }
const StepMessage = ({ message }: { message: ChatInterface }) => {
  const { messageType } = message
  let content: React.ReactNode
  if (messageType === "human") {
    if (Array.isArray(message.content)) {
      content = (
        <div className="bg-primary text-primary-foreground rounded-lg">
          {message.content[0].type === "text" && (
            <div className="p-2">{message.content[0].text}</div>
          )}
          <div className="flex flex-wrap gap-8 p-2">
            {message.content.slice(1).map((m: MessageContentComplex, index) => {
              if (m.type === "image_url") {
                return (
                  <div key={index}>
                    <Image
                      className="max-h-32"
                      src={m.image_url.url}
                      alt={m.image_url.detail}
                    />
                  </div>
                )
              }
            })}
          </div>
        </div>
      )
    } else {
      content = (
        <div className="bg-primary text-primary-foreground rounded-lg">
          <div className="p-2">{message.content.toString()}</div>
        </div>
      )
    }
  } else if (messageType === "tool") {
    content = (
      <div className="bg-yellow-100 text-yellow-800 rounded-lg">
        <div className="p-2">{message.content.toString()}</div>
      </div>
    )
  } else {
    content = (
      <div className="bg-secondary rounded-lg">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
        <div
          className="p-2"
          dangerouslySetInnerHTML={{
            __html: md.render(message.content.toString())
          }}
        />
      </div>
    )
  }

  let icon: React.ReactNode

  if (messageType === "human") {
    icon = <Speech />
  } else if (messageType === "tool") {
    if (message.toolCallStatus === "completed") {
      icon = <Wrench color="#22c55e" />
    } else if (message.toolCallStatus === "process") {
      icon = <Spinner size="small" />
    } else {
      icon = <Wrench color="#ef4444" />
    }
  } else {
    icon = <Bot />
  }

  return (
    <div className="flex mb-2 w-full">
      <div className="flex-grow break-words text-left p-1 whitespace-normal text-base ">
        {content}
      </div>

      <div className="w-6 place-content-center">
        <div className="">
          <Tooltip>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            {message.toolCallMessage && (
              <TooltipContent>
                <p>{message.toolCallMessage}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export const MessagePanel = ({ messages, workflowStatus }) => {
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (scrollArea) {
      scrollArea.scrollIntoView(false)
      // scrollArea.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [messages])

  const messagesInterface = convertMessagesToChatInterfaces(messages)
  return (
    <ScrollArea className="p-4" ref={scrollAreaRef}>
      <div>
        {messagesInterface.map((message: ChatInterface, index) => (
          <div key={index}>
            <StepMessage message={message} />
            <Separator className="mb-2" />
          </div>
        ))}
        {workflowStatus === "running" && (
          <div className="p-2 text-left rounded-lg bg-secondary flex items-center">
            <Spinner size="small" />
            <p className="ml-2">操作中...</p>
          </div>
        )}
        {workflowStatus === "opentab" && (
          <div className="p-2 text-left rounded-lg bg-secondary flex items-center">
            <Spinner size="small" />
            <p className="ml-2">正在打开页面...</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
