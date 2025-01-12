import type { CompiledGraph } from "@langchain/langgraph"
import { v4 as uuidv4 } from "uuid"

// import {app} from "./agent-graph"
function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(blob) // 将 Blob 转为 Base64
  })
}
export const createThread = (): string => {
  return uuidv4()
}

export const getImgOfGraph = async (graph: CompiledGraph<any>) => {
  const representation = await graph.getGraphAsync({ xray: true })
  const image = await representation.drawMermaidPng()
  const base64 = await blobToBase64(image)

  return base64
}
