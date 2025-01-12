"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

export const ModelSettingsSchema = z.object({
  useDefault: z.boolean(),
  model: z.string({}).optional(),
  apiKey: z.string().min(1, { message: "API Key is required" }).optional(),
  apiUrl: z.string().url().optional()
})

export default () => {
  const { toast } = useToast()
  const [modelSettings, setModelSettings] =
    useStorage<z.infer<typeof ModelSettingsSchema>>("modelSettings")
  const form = useForm<z.infer<typeof ModelSettingsSchema>>({
    resolver: zodResolver(ModelSettingsSchema),
    defaultValues: {
      useDefault: true,
      model: "",
      apiKey: "",
      apiUrl: ""
    } // 使用加载完成的 modelSettings 作为初始值
  })

  useEffect(() => {
    // console.log("modelSettings", modelSettings)
    if (modelSettings) {
      if (modelSettings.useDefault) {
        form.reset({
          useDefault: true
        })
      } else {
        form.reset({ ...modelSettings })
      }
    }
  }, [modelSettings])
  // 1. Define your form.

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ModelSettingsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      // console.log("🚀 ~ onSubmit ~ v:", values)
      if (values.useDefault) {
        // 如果选中 "使用默认配置"，则将字段设置为系统默认值
        const v = {
          useDefault: true,
          model: process.env.PLASMO_PUBLIC_DEFULT_MODEL,
          apiKey: process.env.PLASMO_PUBLIC_DEFULT_APIKEY,
          apiUrl: process.env.PLASMO_PUBLIC_DEFULT_APIURL
        }

        setModelSettings(v)
      } else {
        setModelSettings(values)
      }

      toast({
        description: "✅  更新成功"
      })
      // await sendToBackground({ name: "refresh-agent" })
    } catch (e) {
      console.log(e)
      toast({
        variant: "destructive",
        description: e.toString()
      })
    }
  }

  return (
    <div>
      {form ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="useDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      defaultChecked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>使用默认配置</FormLabel>
                </FormItem>
              )}
            />
            {!form.watch("useDefault") && (
              <>
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="example:gpt-4o" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ApiKey</FormLabel>
                      <FormControl>
                        <Input placeholder="sk-xxxxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apiUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BaseUrl</FormLabel>
                      <FormControl>
                        <Input placeholder="https://xxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      ) : (
        <p>加载中...</p> // 可以显示一个加载状态，直到 modelSettings 完成加载
      )}
    </div>
  )
}
