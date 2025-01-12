"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

export const ExtensionSettingsSchema = z.object({
  openPopupOrSidepanel: z.enum(["popup", "sidepanel"])
})

export default () => {
  const { toast } = useToast()
  const [extensionSettings, setExtensionSettings] =
    useStorage<z.infer<typeof ExtensionSettingsSchema>>("extensionSettings")
  const form = useForm<z.infer<typeof ExtensionSettingsSchema>>({
    resolver: zodResolver(ExtensionSettingsSchema),
    defaultValues: {
      openPopupOrSidepanel: "sidepanel"
    } // 使用加载完成的 modelSettings 作为初始值
  })

  useEffect(() => {
    console.log("modelSettings", extensionSettings)
    if (extensionSettings) {
      form.reset({ ...extensionSettings })
    }
  }, [extensionSettings])
  // 1. Define your form.

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ExtensionSettingsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      setExtensionSettings(values)
      const response = await sendToBackground({
        name:"update-extension-settings",
        body: values
      })
      toast({
        description: "✅  更新成功"
      })
    } catch (e) {
      console.log(e)
      toast({
        variant: "destructive",
        description: e.toString()
      })
    }

    console.log(values)
  }

  return (
    <div>
      {form ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="openPopupOrSidepanel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>点击按钮默认打开</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1">
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sidepanel" />
                        </FormControl>
                        <FormLabel className="font-normal">侧边栏</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="popup" />
                        </FormControl>
                        <FormLabel className="font-normal">浮窗</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      ) : (
        <p>加载中...</p> // 可以显示一个加载状态，直到 modelSettings 完成加载
      )}
    </div>
  )
}
