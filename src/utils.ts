import {
  buildElementString,
  ElementTreeFormat,
  type ScrapedPage
} from "@/contents/utils/page-builder"
import { retryAsync } from "ts-retry"

import { sendToContentScript } from "@plasmohq/messaging"

export const getPageScrapeString = async (
  fmt: ElementTreeFormat = ElementTreeFormat.HTML
) => {
  const pageState: ScrapedPage = await retryAsync(
    async () =>
      await sendToContentScript({
        name: "get-web-content"
      }),
    { delay: 500, maxTry: 3 }
  )

  return buildElementString(pageState, fmt)
}

export const getPageScreenshot = async () => {
  const pageScreenshot = await chrome.tabs.captureVisibleTab()
  return pageScreenshot
}

export const pingActiveTab = async () => {
  await retryAsync(
    async () =>
      await sendToContentScript({
        name: "connect-test"
      }),
    { delay: 1000, maxTry: 10 }
  )
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getChromeStatus = async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true, active: true })
  console.log("🚀 ~ getChromeStatus ~ tabs:", tabs)
  let currentPageString: string
  try {
    currentPageString = await getPageScrapeString()
  } catch (e) {
    console.log("🚀 ~ getChromeStatus ~ e:", e)
    currentPageString = "获取页面信息失败"
  }
  const simplifiedTabsString = JSON.stringify(
    tabs.map(({ id, url, active }) => ({ id, url, active }))
  )
  // const statusString = `当前浏览器状态如下:\n\n Tab页信息:${simplifiedTabsString}\n\n active Tab:${currentPageString}`
  const statusString = `当前Tab页面状态如下:${currentPageString}`
  const screenshot = await getPageScreenshot()
  return { statusString, url: tabs[0].url, screenshot }
}
