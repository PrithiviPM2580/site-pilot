import { useQueryState } from "nuqs";

function useCanvas() {
  const [selectedPageId, setSelectedPageId] = useQueryState("page_id", {
    defaultValue: null,
    parse: (v) => v || null,
  });
  return {
    selectedPageId,
    setSelectedPageId,
  };
}

export default useCanvas;
