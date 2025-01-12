import { Storage } from "@plasmohq/storage"

const storage = new Storage()
async function init() {
  await storage.set("modelSettings", {
    useDefault: process.env.PLASMO_PUBLIC_DEFULT_USEDEFAULT,
    model: process.env.PLASMO_PUBLIC_DEFULT_MODEL,
    apiUrl: process.env.PLASMO_PUBLIC_DEFULT_APIURL,
    apiKey: process.env.PLASMO_PUBLIC_DEFULT_APIKEY
  })
  await storage.set("extensionSettings", {
    openPopupOrSidepanel: "sidepanel"
  })
}
// async function test() {
//    console.log(await storage.get("modelSettings"))
//  }

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

chrome.runtime.onInstalled.addListener(async function () {
  // storage.clear()
  console.log("installed")
  const modelSettings = await storage.get("modelSettings")
  if (!modelSettings) {
    await init()
  } else {
    console.log("modelSettings is already set")
  }

  //   await test()
})
