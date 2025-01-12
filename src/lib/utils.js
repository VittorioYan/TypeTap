import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// export function waitForCurrentTabLoad() {
//   return new Promise((resolve, reject) => {
//     // 获取当前活动标签页
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs.length === 0) {
//         reject(new Error("未找到活动标签页"));
//         return;
//       }

//       const tabId = tabs[0].id;

//       // 定义监听器
//       const listener = (updatedTabId, changeInfo) => {
//         if (updatedTabId === tabId) {
//           // 检查页面加载状态
//           if (changeInfo.status === "complete") {
//             // 页面加载完成，移除监听器并解析 Promise
//             chrome.tabs.onUpdated.removeListener(listener);
//             resolve("页面加载完成");
//           } else if (changeInfo.status === "loading") {
//             console.log("页面加载中...");
//           }
//         }
//       };

//       // 添加监听器
//       chrome.tabs.onUpdated.addListener(listener);

//       // 超时处理：防止一直等待
//       setTimeout(() => {
//         chrome.tabs.onUpdated.removeListener(listener);
//         reject(new Error("页面加载超时"));
//       }, 30000); // 设置30秒超时
//     });
//   });
// }
