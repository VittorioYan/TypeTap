// 监听停止消息的处理器
import type { PlasmoMessaging } from "@plasmohq/messaging"

import { cancelTask } from "../ports/workflow"

// export type RequestBody = {
//   input: number
// }

// export type RequestResponse = number

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("🚀 ~ >= stop-workflow ~ req:", req)

  const { threadId } = req.body
  const cancelResult = await cancelTask(threadId)

  res.send(cancelResult)
//   res.send({status:"fail",message:"nononono"})
}

export default handler
