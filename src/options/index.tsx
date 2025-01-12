
import "@/style.css"

import { Separator } from "@/components/ui/separator"
import SettingForm from "./SettingForm"
import { Toaster } from "@/components/ui/toaster"

import { Storage } from "@plasmohq/storage"
const storage = new Storage()
chrome.runtime.onInstalled.addListener(async ()=>await init())
async function init() {
  console.log(process.env.PLASMO_PUBLIC_DEFULT_MODEL)
  await storage.set("modelSettings", {
    model: process.env.PLASMO_PUBLIC_DEFULT_MODEL,
    apiKey: "",
    apiUrl: process.env.PLASMO_PUBLIC_DEFULT_APIURL
  })
}

export default function SettingsProfilePage() {
  return (
    <div className="h-full w-full flex justify-center pt-[10vh]">

      <div className="flex-col">
        <h3 className="text-4xl font-medium mb-4">设置</h3>
        <SettingForm />
      </div>
      <Toaster/>
    </div>

  )
}