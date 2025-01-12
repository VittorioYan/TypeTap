"use client"

import { UploadOutlined } from "@ant-design/icons"
import type { DatePickerProps, UploadFile } from "antd"
import { Button, DatePicker, Select, Upload } from "antd"
import type { Dayjs } from "dayjs"
import Link from "next/link"
import React, { useEffect, useState } from "react"

const onSearch = (value: string) => {
  console.log("search:", value)
}

const onChange: DatePickerProps<Dayjs[]>["onChange"] = (date, dateString) => {
  console.log(date, dateString)
}

export default () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  useEffect(() => {
    setTimeout(() => {
      console.log("useEffect")
    }, 3000)
  }, [])
  const [pageData, setPageData] = useState(0)
  return (
    <div>
      <Select
        showSearch
        placeholder="Select a person"
        optionFilterProp="label"
        onSearch={onSearch}
        options={[
          {
            value: "jack",
            label: "Jack"
          },
          {
            value: "lucy",
            label: "Lucy"
          },
          {
            value: "tom",
            label: "Tom"
          },
          {
            value: "tom1",
            label: "2024-09-20"
          }
        ]}
      />
      <DatePicker onChange={onChange} needConfirm />
      <Button onClick={() => setPageData(pageData + 1)}>测试点击</Button>
      <Upload
        className="m-4"
        fileList={fileList}
        listType="picture-circle"
        onChange={({ file, fileList, event }) => {
          setFileList(fileList)
        }}>
        <Button>
          <span className="sr-only">Upload Image</span>
        </Button>
      </Upload>
      <Link href="https://www.baidu.com">百度</Link>
      {/* <Button onClick={()=>setPageData(pageData+1)}>跳转到新页面</Button> */}
      <div>{pageData}</div>
    </div>
  )
}

// export default App;
