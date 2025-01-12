# README



https://github.com/user-attachments/assets/1efd0bbb-c8e7-4d0a-90d5-07ce259f4950



## 使用方法

1. 复制example.env 为.env

```shell
cp example.env .env
```

2. 修改.env参数，主要需要修改API_KEY。

```yaml
# 测试模式，默认关闭
PLASMO_PUBLIC_DEBUG_MODE=FALSE
# 是否使用默认模型配置
PLASMO_PUBLIC_DEFULT_USEDEFAULT=true
PLASMO_PUBLIC_DEFULT_MODEL=gpt-4o
PLASMO_PUBLIC_DEFULT_APIURL="https://api.openai-forward.com/v1"
# 关键需要配置API_KEY
PLASMO_PUBLIC_DEFULT_APIKEY="sk-xx"
# 是否支持图片
PLASMO_PUBLIC_SUPPORT_IMAGE=FALSE
```

3. 建议使用pnpm进行依赖安装

```shell
pnpm i
```

4. 打包

```shell
pnpm build:plasmo
```

5. 打包完成后，进入浏览器（建议使用Chrome）-插件管理-打开开发者模式-加载已解压的扩展程序。选择./build/chrome-mv3-prod
6. 点击插件即可使用
