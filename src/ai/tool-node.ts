import {
  AIMessage,
  BaseMessage,
  isBaseMessage,
  ToolMessage
} from "@langchain/core/messages"
import {
  RunnableToolLike,
  type RunnableConfig
} from "@langchain/core/runnables"
import type { StructuredToolInterface } from "@langchain/core/tools"
import { RunnableCallable } from "@langchain/langgraph/dist/utils"

export type ToolNodeOptions = {
  name?: string
  tags?: string[]
  handleToolErrors?: boolean
  //   execSquence?: boolean
}
export class SyncToolNode<T = any> extends RunnableCallable<T, T> {
  tools: (StructuredToolInterface | RunnableToolLike)[]

  handleToolErrors = true

  execSquence = false

  constructor(
    tools: (StructuredToolInterface | RunnableToolLike)[],
    options?: ToolNodeOptions
  ) {
    const { name, tags, handleToolErrors } = options ?? {}
    super({ name, tags, func: (input, config) => this.run(input, config) })
    this.tools = tools
    this.handleToolErrors = handleToolErrors ?? this.handleToolErrors

    // this.execSquence = execSquence ?? this.execSquence
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async run(input: any, config: RunnableConfig): Promise<T> {
    const message = Array.isArray(input)
      ? input[input.length - 1]
      : input.messages[input.messages.length - 1]

    const pageState = input.pageState

    if (message?._getType() !== "ai") {
      throw new Error("ToolNode only accepts AIMessages as input.")
    }

    const outputs: BaseMessage[] = []

    // 使用 for...of 进行顺序执行
    for (const call of (message as AIMessage).tool_calls ?? []) {
      const tool = this.tools.find((tool) => tool.name === call.name)
      try {
        if (tool === undefined) {
          throw new Error(`Tool "${call.name}" not found.`)
        }

        const output = await tool.invoke(
          { ...call, type: "tool_call", pageState },
          config
        )
        console.log("🚀 ~ SyncToolNode<T ~ run ~ output:", output)

        if (isBaseMessage(output) && output._getType() === "tool") {
          outputs.push(output)
        } else {
          outputs.push(
            new ToolMessage({
              name: tool.name,
              content:
                typeof output === "string" ? output : JSON.stringify(output),
              tool_call_id: call.id!
            })
          )
        }
      } catch (e: any) {
        if (!this.handleToolErrors) {
          throw e
        }
        console.log("Error in tool:", e.message)
        outputs.push(
          new ToolMessage({
            content: `Error: ${e.message}\n Please fix your mistakes.`,
            name: call.name,
            tool_call_id: call.id ?? ""
          })
        )
      }
    }

    return (Array.isArray(input) ? outputs : { messages: outputs }) as T
  }
}
