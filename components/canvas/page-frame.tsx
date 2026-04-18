import { TOOL_MODE_ENUM, ToolModeType } from "@/constants";
import { useEffect, useRef, useState } from "react";
import { getHTMLWrapper } from "@/lib/page-wrapper";
import { Rnd } from "react-rnd";
import { cn } from "@/lib/utils";

type PageFrameProps = {
  page: any;
  initialPosition?: { x: number; y: number };
  scale?: number;
  toolMode: ToolModeType;
  selectedFrameId: string | null;
  setSelectedFrameId: (id: string | null) => void;
};

function PageFrame({
  page,
  initialPosition = { x: 0, y: 0 },
  scale = 1,
  toolMode,
  selectedFrameId,
  setSelectedFrameId,
}: PageFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState({ width: 1550, height: 900 });
  const [isHovered, setIsHovered] = useState(false);

  const fullHtml = getHTMLWrapper(
    page.htmlContent,
    page.name,
    page.rootStyles,
    page.id,
  );

  const isSelected = selectedFrameId === page.id;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "FRAME_HEIGHT" && event.data.pageId === page.id) {
        setSize((prev) => ({
          ...prev,
          height: event.data.height,
        }));
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <Rnd
        default={{
          x: initialPosition?.x,
          y: initialPosition?.y,
          width: size.height,
          height: size.height,
        }}
        size={{ width: size.width, height: size.height }}
        minHeight={320}
        minWidth={900}
        scale={scale}
        disableDragging={toolMode === TOOL_MODE_ENUM.HAND}
        enableResizing={
          (isSelected || isHovered) && toolMode !== TOOL_MODE_ENUM.HAND
        }
        onResize={(e, direction, ref) => {
          setSize({
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          });
        }}
        onClick={(e: any) => {
          e.stopPropagation();
          if (toolMode === TOOL_MODE_ENUM.SELECT) {
            setSelectedFrameId(page.id);
          }
        }}
        resizeHandleComponent={{
          topLeft: isSelected || isHovered ? <Handle /> : undefined,
          topRight: isSelected || isHovered ? <Handle /> : undefined,
          bottomLeft: isSelected || isHovered ? <Handle /> : undefined,
          bottomRight: isSelected || isHovered ? <Handle /> : undefined,
        }}
        className={cn(
          "relative z-30",
          (isSelected || isHovered) &&
            toolMode !== TOOL_MODE_ENUM.HAND &&
            "ring-3 ring-blue-400 ring-offset-1",
          toolMode === TOOL_MODE_ENUM.HAND
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-move",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full relative overflow-hidden rounded-sm bg-muted/90 ">
          <iframe
            ref={iframeRef}
            srcDoc={fullHtml}
            title={page.name}
            sandbox="allow-script"
            style={{
              width: "100%",
              height: `${size.height}px`,
              border: "none",
              display: "block",
              pointerEvents: "none",
            }}
          ></iframe>
        </div>
      </Rnd>
    </>
  );
}

function Handle() {
  return (
    <div className="z-30 h-4 w-4 bg-white border-2 border-blue-500 shadow-sm"></div>
  );
}

export default PageFrame;
