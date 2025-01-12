import generateElementsSelector from "@/lib/generateElementsSelector"
import { finder } from "@medv/finder"
import { useMessage } from "@plasmohq/messaging/hook"
import type { PlasmoCSConfig } from "plasmo"
// export const config: PlasmoCSConfig = {
//   matches: ["http://localhost:1947/*"]
// }
//TODO add iframe support
import React, { useEffect, useState } from "react"

interface ElementRect {
  element: Element
  x: number
  y: number
  width: number
  height: number
}

interface ElementHighlighteType {
  pause?: boolean,
  disabled: boolean,
  onBackMessage
 
}
const ElementHighlighter:React.FC<ElementHighlighteType>=({
  pause=false,
  disabled=false,
  onBackMessage
}) => {
  const [hoveredElement, setHoveredElement] = useState<ElementRect | null>(null)
  const [selectedElement, setSelectedElement] = useState<ElementRect | null>(
    null
  )
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [lastScrollPos, setLastScrollPos] = useState({
    x: window.scrollX,
    y: window.scrollY
  })

  useEffect(() => {
    const onScroll = () => {
      if (disabled) return

      // 清除悬停元素状态
      setHoveredElement(null)

      // 计算滚动位移差
      const deltaX = window.scrollX - lastScrollPos.x
      const deltaY = window.scrollY - lastScrollPos.y

      // 如果有选中元素，则更新它的位置
      if (selectedElement) {
        setSelectedElement((prev) => {
          if (!prev) return null
          return {
            ...prev,
            x: prev.x - deltaX,
            y: prev.y - deltaY
          }
        })
      }

      // 更新最后滚动位置
      setLastScrollPos({ x: window.scrollX, y: window.scrollY })
    }

    const retrieveElementsRect = (
      event: MouseEvent,
      type: "hovered" | "selected"
    ) => {
      const target = document.elementsFromPoint(
        event.clientX,
        event.clientY
      )[1] as HTMLElement
      if (!target || disabled) return

      const rect = target.getBoundingClientRect()
      const elementData: ElementRect = {
        element: target,
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      }

      if (type === "hovered") {
        setHoveredElement(elementData)
      } else if (type === "selected") {
        setSelectedElement(elementData)
        console.log("🚀 ~ useEffect ~ target:", target)
        console.log("🚀 ~ retrieveElementsRect ~ finder(target):", finder(target))
        onBackMessage(finder(target))
      }
    }
      

    const onMouseMove = (event: MouseEvent) => {
      if (!pause) {
        setMousePosition({ x: event.clientX, y: event.clientY })
        retrieveElementsRect(event, "hovered")
      }
    }

    const onClick = (event: MouseEvent) => {
      retrieveElementsRect(event, "selected")
    }

    window.addEventListener("scroll", onScroll)
    window.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mousedown", onClick)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mousedown", onClick)
    }
  }, [disabled, pause, selectedElement, lastScrollPos])

  return (
    <>
      {!disabled && (
        <svg
          className="automa-element-highlighter"
          style={{
            height: "100%",
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 999999
          }}>
          {/* Render hovered element */}
          {hoveredElement && (
            <rect
              x={hoveredElement.x}
              y={hoveredElement.y}
              width={hoveredElement.width}
              height={hoveredElement.height}
              stroke="#fbbf24"
              fill="rgba(251, 191, 36, 0.1)"
            />
          )}
          {/* Render selected element */}
          {selectedElement && (
            <rect
              x={selectedElement.x}
              y={selectedElement.y}
              width={selectedElement.width}
              height={selectedElement.height}
              stroke="#2563EB"
              fill="rgba(37, 99, 235, 0.1)"
            />
          )}
        </svg>
      )}
      {!disabled && (
        <div
          id="automa-selector-overlay"
          style={{
            zIndex: 9999999,
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%"
          }}></div>
      )}
    </>
  )
}

export default ()=>{
  const { data } = useMessage<string, any>(async (req: any, res) => {
    console.log("🚀 ~ const{data}=useMessage<string,string> ~ req:", req)
    if (req.name === "select-element") {
      
      setSelectState(false)
      console.log("🚀 ~ selectState:", selectState)
    }
    if (req.name === "stop-select") {
      
      setSelectState(true)
      res.send(selector)
    }
    if (req.name === "show-select-element") {
      const {selector} = req.body
      const element = document.querySelector(selector)
      setSelectState(false)
      //TODO:高亮逻辑重写
      
    }
  })
  const [selectState, setSelectState] = useState(true)
  const [selector,setSelector] = useState("")
  

  
  return (<>
  {!selectState && <div>{selector}</div>}
  <ElementHighlighter disabled={selectState} onBackMessage={setSelector}/>
  </>)
  
}

// export default ElementHighlighter
