import { effect } from "@preact/signals-core";
import { useEffect, useState } from "react";
import type { Signal } from "./signals";

type ExtractSignal<T> = T extends Signal<infer U> ? U : never;
export type UnwrapSignals<T> = { [K in keyof T]: ExtractSignal<T[K]> };

export function useSignalState<R extends Record<string, Signal>>(signals: R): UnwrapSignals<R> {
  const signalsToListen = new Set<Signal>();

  const [_, triggerRerender] = useState(Symbol());

  useEffect(() => {
    let track = false;
    return effect(() => {
      for (const s of signalsToListen) s.value;
      if (track) triggerRerender(Symbol());
      else track = true;
    });
  }, [signalsToListen]);

  return new Proxy({} as UnwrapSignals<R>, {
    get(_, key) {
      const signal = signals[key as keyof R];
      signalsToListen.add(signal);
      return signal.value;
    },
  });
}
