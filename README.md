# React Signal State

> MOME, can we get [SolidJS](https://www.solidjs.com/)
>
> No. There is SolidJS at home.
>
> SolidJS at home:

## Installation

```bash
pnpm add react-signal-state
```

## Main APIs

### `useSignalState`

```tsx
import { useSignalState } from "react-signal-state";
import { signal } from "@preact/signals-core";

const counter = signal(0);
setInterval(() => (counter.value = counter.value + 1), 1000);

function Counter() {
  const $ = useSignalState({ count: counter });
  return <div>{$.count}</div>;
}
```

### `createSignalStore`

```tsx
import { createSignalStore } from "react-signal-state/store";
import { signal, computed } from "@preact/signals-core";

const store = createSignalStore(({ initialName }: { initialName: string }) => {
  const name = signal(initialName);
  const showedName = computed(() => (name.value === "React" ? "Solid" : name.value));

  return {
    $: { name, showedName },
    changeName: (newName: string) => (name.value = newName),
  };
});

function App() {
  return (
    <store.provider initialName="React">
      <Name />
    </store.provider>
  );
}

function Name() {
  const { $, changeName } = store.useSignalState();
  return (
    <div>
      <input value={$.name} onChange={(e) => changeName(e.target.value)} />
      <div>{$.showedName}</div>
    </div>
  );
}
```

## Why

Making complex state in React is hard. State is attached to the component tree, and it's difficult to model complex and shared state between components.
Hooks like `useState` and `useContext` are great, but have a mental model that is hard (or tedious) to scale.

That why many state solutions exist for React, like [Redux](https://redux-toolkit.js.org/), [Tanstack](https://tanstack.com/query), [Jotai](https://jotai.org/) and [Zuztand](https://zustand.docs.pmnd.rs/getting-started/introduction).
or even similar alternatives or compilers, like [Preact](https://github.com/preactjs) and [Million.js](https://million.js.org/). It's a _fundamental_ problem in a **great** ecosystem.

Event thought the great advances in developer experience, there is space to improve.
The idea of this library, at the current state, is to explore different patterns that seems to be more unexplored, using Signals and ideas from [SolidJS](https://www.solidjs.com/).

## Capabilities

[See the example code](src/demo/App.tsx).

- **Smart subscriptions**: Instead of a selection like pattern, like:
  ```ts
  const stateA = useStore((state) => state.a);
  ```
  This library tracks automatically witch signal is accessed and subscribe to it, using a proxy.
  ```ts
  function WillOnlyRunOnAChange() {
    const $ = useSignalState({ a: signal(1), b: signal(2) });
    console.log($.a); // Will only run when $.a changes.
  }
  ```
- **Great composition**: Signals are already composable.
  This library also allows to compose via context.

  ```ts
  const storeA = createSignalStore(() => {
    const a = signal(1);
    return { $: { a } };
  });
  const storeB = createSignalStore(() => {
    const { a } = storeA.useStore();
    const b = computed(() => a.value + 1);
    return { $: { b } };
  });
  ```

- Incredible small.
- Supports SSR. Doesn't need hydration helpers, it just works.
- Does not require any code transformation.

## Notes and remaining things to explore

- Should this library use `@preact/signals-core`? Is there another signal library that is better?
- This readme probably should be rewritten.
- Ths `useStore` inside `createSignalStore` is weird. But is it ilegal? See if React's `use` is more appropriate.
- Tracking with effects is _hacky_. An implementation with an API like `Watcher` in the [Signal Proposal](https://github.com/tc39/proposal-signals?tab=readme-ov-file#api-sketch) might be preferable.
