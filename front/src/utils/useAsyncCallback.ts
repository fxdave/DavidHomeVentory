import {useCallback} from "react";
import {toast} from "react-toastify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

export function asyncCallback<T extends AnyFn>(cb: T) {
  return (...args: unknown[]) =>
    cb(args).catch((e: unknown) => {
      if (e instanceof Error) {
        toast(e.message, {type: "error"});
      }
      console.error(e);
    }) as T;
}

export function useAsyncCallback<T extends AnyFn>(
  cb: T,
  dependencies: unknown[],
) {
  return useCallback(asyncCallback(cb), dependencies) as T;
}
