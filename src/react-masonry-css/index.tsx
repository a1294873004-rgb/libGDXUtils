import { Masonry } from "./react-masonry-css";
import "./App.less";

function App() {
  // 模拟 12 个卡片
  const items = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    height: 100 + Math.random() * 150, // 高度随机，用来演示瀑布流
    text: `Card ${i + 1}`,
  }));

  // 响应式列数
  const breakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Masonry Demo</h1>

      <Masonry
        breakpointCols={breakpoints}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {items.map((item) => (
          <div key={item.id} className="card" style={{ height: item.height }}>
            {item.text}
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export { App as ReactMasonryCss };
