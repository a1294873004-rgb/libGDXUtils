import React, { useRef, useEffect, useState } from "react";
import "./MarqueeTags.less";

interface MarqueeTagsProps {
  tags?: string[];
  speed?: number; // 每次循环的耗时（秒）
  gap?: number; // tag 之间的间距（px）
}
const DEFAULT_TAGS = ["AI", "React", "TypeScript", "CSS", "Frontend"];
const MarqueeTags: React.FC<MarqueeTagsProps> = ({
  tags = DEFAULT_TAGS,
  speed = 2,
  gap = 16,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setWidth(contentRef.current.scrollWidth);
    }
  }, [tags]);

  return (
    <div className="marquee">
      <div
        className="marquee-content"
        style={{
          animationDuration: `${speed}s`,
          columnGap: `${gap}px`,
        }}
      >
        <div className="marquee-inner" ref={contentRef}>
          {tags.map((tag, index) => (
            <span className="tag" key={index}>
              {tag}
            </span>
          ))}
        </div>

        {/* 自动复制一份，用于无缝滚动 */}
        {width > 0 && (
          <div className="marquee-inner clone" style={{ width }}>
            {tags.map((tag, index) => (
              <span className="tag" key={`clone-${index}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { MarqueeTags };
