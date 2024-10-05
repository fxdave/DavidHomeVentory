import {MutableRefObject, useState, useEffect, useMemo} from "react";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";

export function useInfinityScroll(
  list: WarehouseEntryWithPath[],
  watchedDivRef: MutableRefObject<HTMLDivElement | null>,
) {
  const listLength = list.length;
  const [currentMaxIndex, setCurrentMaxIndex] = useState(20);

  useEffect(() => {
    setCurrentMaxIndex(20);
    if (!watchedDivRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setCurrentMaxIndex(oldValue => Math.min(oldValue + 10, listLength));
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      },
    );
    observer.observe(watchedDivRef.current);

    return () => {
      observer.disconnect();
    };
  }, [list]);

  return useMemo(() => {
    return list.slice(0, currentMaxIndex);
  }, [currentMaxIndex, list]);
}
