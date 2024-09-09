import { ReactNode, createContext, useContext, useState } from "react";
import type { Signal } from "./signals";
import { type UnwrapSignals, useSignalState } from "./hook";

export type SignalStore = {
  /** The reactive signals */
  $: Record<string, Signal>;
  /** Any other value that should not be tracked */
  [key: string]: any;
};

/** Creates a store, with the $ property containing the signals */
export function createSignalStore<Args, Store extends SignalStore>(fn: (props: Args) => Store) {
  const context = createContext<Store | null>(null);

  function useStore() {
    const store = useContext(context);
    if (!store) throw new Error("useStore must be used within a StoreProvider");
    return store;
  }

  function _useSignalState(): Omit<Store, "$"> & { $: UnwrapSignals<Store["$"]> } {
    const store = useStore();
    const $ = useSignalState(store.$);
    return { ...store, $ };
  }

  function provider(props: Args & { children?: ReactNode }) {
    const [ctxValue] = useState(() => fn(props));
    return <context.Provider value={ctxValue} children={props.children} />;
  }

  return { useStore, useSignalState: _useSignalState, provider };
}
