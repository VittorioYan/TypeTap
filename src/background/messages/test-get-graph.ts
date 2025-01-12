import { graph } from "@/ai/rpa-graph"
import { getImgOfGraph } from "@/ai/service"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("🚀 ~ >= get graph ~ req:", req)
  const result = await getImgOfGraph(graph)

  res.send(result)
}

export default handler
