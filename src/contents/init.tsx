import type { PlasmoCSConfig } from "plasmo"

import { sendToBackgroundViaRelay } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start"
  // world: "MAIN"
}

export default () => {
  // 创建 <style> 元素
  const style = document.createElement("style")

  // 添加到 <head> 中
  document.head.appendChild(style)

  // 添加样式规则
  const sheet = style.sheet
  sheet.insertRule(
    ".typeTap-highlight {outline: 2px solid red;transition: outline 0.3s ease;}",
    sheet.cssRules.length
  )

  return <></>
}
