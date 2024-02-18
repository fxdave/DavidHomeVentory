import {useEffect} from "react";
import {toast} from "react-toastify";

export function useAsyncEffect(
  cb: () => Promise<void>,
  dependencies: unknown[],
) {
  useEffect(() => {
    cb().catch(e =>
      toast(e instanceof Error ? e.message : e, {
        type: "error",
      }),
    );
  }, dependencies);
}
