"use client"
import React, { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(true);

  // 页面首次加载时设置为 loading 状态，并在3秒后转为 complete
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false); // 设置页面加载完成
    }, 3000);

    // 清理定时器
    return () => clearTimeout(timer);
  }, []);

  // 点击按钮再次模拟 loading 状态
  const handleClick = () => {
    setLoading(true); // 设置为 loading 状态
    const timer = setTimeout(() => {
      setLoading(false); // 3秒后恢复到 complete 状态
    }, 3000);

    // 清理定时器
    return () => clearTimeout(timer);
  };

  return (
    <div className={`page ${loading ? 'loading' : 'complete'}`}>
      <h1>{loading ? '页面加载中...' : '页面加载完成！'}</h1>
      <button onClick={handleClick}>重新加载页面</button>
      <style jsx>{`
        .page.loading {
          background-color: yellow; /* loading 状态的背景色 */
        }
        .page.complete {
          background-color: lightgreen; /* complete 状态的背景色 */
        }
      `}</style>
    </div>
  );
}

export default App;