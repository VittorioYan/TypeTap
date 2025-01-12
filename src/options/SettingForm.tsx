import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ExtensionSetting from "../components/ExtensionSetting"
import ModelSetting from "../components/ModelSetting"

export default () => {
  return (
    <Tabs defaultValue="model" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="model">模型配置</TabsTrigger>
        <TabsTrigger value="extension">插件配置</TabsTrigger>
      </TabsList>
      <TabsContent value="model">
        <Card>
          <CardHeader>
            <CardTitle>模型配置</CardTitle>
            <CardDescription>
              在此处选择需要使用的模型，及配置对应key。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ModelSetting />
          </CardContent>
        </Card>
      </TabsContent>
      {/* <TabsContent value="extension">
        <Card>
          <CardHeader>
            <CardTitle>插件配置</CardTitle>
            <CardDescription>此页面用于配置一些插件选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ExtensionSetting />
          </CardContent>
        </Card>
      </TabsContent> */}
    </Tabs>
  )
}
