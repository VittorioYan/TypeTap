// 监听停止消息的处理器
import type { PlasmoMessaging } from "@plasmohq/messaging"

import { rebuildApp } from "../ports/workflow"


// export type RequestBody = {
//   input: number
// }

// export type RequestResponse = number

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("🚀 ~ >= rebuildApp ~ req:", req)
  const cancelResult = rebuildApp()

  res.send({status:"success",message:"Rebuilding App"})
//   res.send({status:"fail",message:"nononono"})
}

export default handler
