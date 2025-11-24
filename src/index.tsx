import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Icon } from "./Icon";
import { ReactMasonryCss } from "./react-masonry-css";

const CHANNEL_NAME = "sse_channel";
window.addEventListener("storage", (e) => {
  console.log("storage change", e?.key);
});

const BroadcastChannelTest: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [tabId] = useState(() => Math.random().toString(36).slice(2, 8));
  localStorage.setItem("fuck1", "fuck12");
  localStorage.setItem("fuck1", "fuck121");

  useEffect(() => {
    // 创建 BroadcastChannel
    const bc = new BroadcastChannel(CHANNEL_NAME);

    console.log(`[BC-${tabId}] ✅ 已连接频道:`, CHANNEL_NAME);

    // 监听消息
    bc.onmessage = (event) => {
      console.log(`[BC-${tabId}] 📩 收到消息:`, event.data);
      setMessages((prev) => [
        ...prev,
        `[来自 ${event.data.from}] ${event.data.text}`,
      ]);
    };

    bc.onmessageerror = (err) => {
      console.error(`[BC-${tabId}] ❌ 消息错误:`, err);
    };

    return () => {
      console.log(`[BC-${tabId}] 📴 关闭频道`);
      bc.close();
    };
  }, [tabId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const bc = new BroadcastChannel(CHANNEL_NAME);
    const msg = {
      from: tabId,
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    console.log(`[BC-${tabId}] 📤 发送消息:`, msg);
    bc.postMessage(msg);
    setMessages((prev) => [...prev, `[我自己] ${msg.text}`]);
    setInput("");
    bc.close(); // 发送完可以关闭临时实例（或者复用全局的）
  };

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <div>
        <div>ICONs</div>
        <Icon symbol="Twitter" width={60} height={60} />
        <Icon symbol="Instagram" width={60} height={60} />
        <Icon symbol="TikTok" width={60} height={60} />
        <Icon symbol="Youtube" width={60} height={60} />
      </div>
      <h2>🔊 BroadcastChannel 测试</h2>
      <p>
        当前 Tab ID: <b>{tabId}</b>
      </p>

      <div style={{ marginBottom: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息后按发送"
          style={{ padding: "6px 10px", width: 300, marginRight: 10 }}
        />
        <button onClick={sendMessage}>发送</button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          width: 400,
          height: 200,
          overflowY: "auto",
          background: "#f9f9f9",
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
    </div>
  );
};

// 创建 root
// const root = createRoot(document.getElementById("root")!);

// 渲染组件
// root.render(<ReactMasonryCss />);
// export { BroadcastChannelTest };
export { ReactMasonryCss as App };
