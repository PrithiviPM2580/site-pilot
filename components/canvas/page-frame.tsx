import { TOOL_MODE_ENUM, ToolModeType } from "@/constants";
import { useEffect, useMemo, useRef, useState } from "react";
import { getHTMLWrapper } from "@/lib/page-wrapper";
import { Rnd } from "react-rnd";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Code2, PaintbrushIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type PageFrameProps = {
  page: any;
  initialPosition?: { x: number; y: number };
  scale?: number;
  toolMode: ToolModeType;
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
  isDeleting: boolean;
  onDeletePage: (id: string) => void;
};

function PageFrame({
  page,
  initialPosition = { x: 0, y: 0 },
  scale = 1,
  toolMode,
  selectedPageId,
  setSelectedPageId,
  isDeleting,
  onDeletePage,
}: PageFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState({ width: 1550, height: 900 });
  const [isHovered, setIsHovered] = useState(false);
  const [showColorScheme, setShowColorScheme] = useState(false);

  const fullHtml = getHTMLWrapper(
    page.htmlContent,
    page.name,
    page.rootStyles,
    page.id,
  );

  const isSelected = selectedPageId === page.id;

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

  const colorTokens = useMemo(() => {
    if (!page.rootStyles) return [];
    const tokens = [
      { key: "--background", label: "Background" },
      { key: "--foreground", label: "Foreground" },
      { key: "--primary", label: "Primary" },
      { key: "--secondary", label: "Secondary" },
      { key: "--accent", label: "Accent" },
      { key: "--card", label: "Card" },
      { key: "--muted", label: "Muted" },
      { key: "--border", label: "Border" },
    ];
    return tokens
      .map(({ key, label }) => {
        const match = page.rootStyles.match(new RegExp(`${key}:\\s*([^;]+)`));
        return { label, value: match ? match[1].trim() : null };
      })
      .filter((t) => t.value);
  }, [page.rootStyles]);

  function handleCopyCode() {
    navigator.clipboard.writeText(fullHtml);
    toast.success("Design code copied to clipboard");
  }

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
            setSelectedPageId(page.id);
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
            "ring-4 ring-blue-500 ring-offset-1",
          toolMode === TOOL_MODE_ENUM.HAND
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-move",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {(isSelected || isHovered) && toolMode !== TOOL_MODE_ENUM.HAND && (
          <div
            className="absolute -top-13 left-0 z-50 flex items-center bg-card rounded-lg px-1 py-1 shadow-md"
            style={{
              transform: `scale(${1 / scale})`,
              transformOrigin: "bottom left",
            }}
          >
            <h5 className="text-xs pl-3 pr-6 font-medium truncate max-w-37.5">
              {page.name}
            </h5>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center px-2 gap-1">
              <Popover open={showColorScheme} onOpenChange={setShowColorScheme}>
                <PopoverTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="p-1 hover:bg-accent size-6 cursor-pointer"
                  >
                    <PaintbrushIcon className="size-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-52 p-3">
                  <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase">
                    Color Schema
                  </p>
                  <div className="flex flex-col gap-2 ">
                    {colorTokens.map(({ label, value }) => (
                      <div
                        className="flex items-center justify-between gap-2"
                        key={label}
                      >
                        <span className="text-xs text-muted-foreground">
                          {label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="size-4 rounded-sm border border-border"
                            style={{ backgroundColor: value }}
                          >
                            <span className="text-xs font-mono text-foreground">
                              {value}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="p-1 hover:bg-accent size-6 cursor-pointer"
                onClick={handleCopyCode}
              >
                <Code2 className="size-3.5" />
              </Button>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="p-1 hover:bg-accent size-6 cursor-pointer"
                onClick={() => onDeletePage(page.id)}
              >
                {isDeleting ? <Spinner /> : <TrashIcon className="size-3.5" />}
              </Button>
            </div>
          </div>
        )}
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
