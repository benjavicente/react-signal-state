import { createSignalStore } from "../api/store";
import { batch, signal, computed } from "@preact/signals-core";

const demoStore = createSignalStore(({ initialName }: { initialName: string }) => {
  const name = signal(initialName);

  const currentTime = signal(Date.now());
  setInterval(() => (currentTime.value = Date.now()), 1000);

  const a = signal(1);
  const b = signal(2);
  const c = signal(3);
  const showBorC = computed(() => (a.value % 2 === 0 ? "b" : "c"));

  let counter = 0;
  const logs = signal<[number, string][]>([]);

  return {
    $: { name, currentTime, a, b, c, showBorC, logs },
    setName: (newName: string) => (name.value = newName),
    randomA: () => (a.value = Math.floor(Math.random() * 10)),
    randomB: () => (b.value = Math.floor(Math.random() * 10)),
    randomC: () => (c.value = Math.floor(Math.random() * 10)),
    randomEverything: () =>
      batch(() => {
        a.value = Math.floor(Math.random() * 10);
        b.value = Math.floor(Math.random() * 10);
        c.value = Math.floor(Math.random() * 10);
      }),
    log: (message: string) =>
      batch(() => {
        logs.value.push([counter++, message]);
        if (logs.value.length > 10) logs.value = logs.value.slice(1, 11);
        else logs.value = [...logs.value];
      }),
  };
});

export default function App() {
  return (
    <demoStore.provider initialName="Solid">
      <div className="flex-grow flex justify-center items-center flex-col gap-4 px-2 pb-4 pt-24">
        <Name />
        <Time />
        <ABC />
      </div>
      <ul id="logs" className="h-64 bg-base-200 flex flex-col justify-end overflow-clip text-center" />
    </demoStore.provider>
  );
}

const nameStore = createSignalStore(() => {
  const { $ } = demoStore.useStore();
  const showedName = computed(() => ($.name.value === "Solid" ? "React" : $.name.value));
  return { $: { showedName } };
});

function Name() {
  const { $, setName } = demoStore.useSignalState();
  window.log("Rendered Name");
  return (
    <div className="text-center flex flex-col gap-2 justify-center items-center">
      <nameStore.provider>
        <NameDisplay />
      </nameStore.provider>
      <label className="flex gap-2 items-center">
        <div>Change the name:</div>
        <input
          className="p-1 outline outline-slate-700"
          value={$.name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
        />
      </label>
    </div>
  );
}

function NameDisplay() {
  const { $ } = nameStore.useSignalState();
  return <h1 className="text-3xl sm:text-4xl font-bold overflow-ellipsis">Hello, {$.showedName}</h1>;
}

function Time() {
  const { $ } = demoStore.useSignalState();
  window.log("Rendered Time");
  return <div>Current time: {new Date($.currentTime).toLocaleTimeString()}</div>;
}

function ABC() {
  const { $, randomA, randomB, randomC, randomEverything } = demoStore.useSignalState();
  window.log("Rendered ABC");
  return (
    <div>
      <h2 className="text-center py-4">
        See what happens when a signal value that is <span className="text-info">not rendered</span> is updated
      </h2>
      <div className="grid grid-cols-2 gap-2 flex-wrap">
        <button className="btn" onClick={randomA}>
          Random A
        </button>
        <button className="btn" onClick={randomEverything}>
          Random All
        </button>
        <button className="btn text-accent" onClick={randomB}>
          Random B
        </button>
        <button className="btn text-primary" onClick={randomC}>
          Random C
        </button>
      </div>
      <div className="grid gap-2 grid-cols-2 text-center">
        <div className="p-4">Value of A: {$.a}</div>

        {$.showBorC === "b" ? (
          <div className="p-4 text-accent">Value of B: {$.b}</div>
        ) : (
          <div className="p-4 text-primary">Value of C: {$.c}</div>
        )}
      </div>
    </div>
  );
}

// Hacky hay to display logs without breaking React's rules
declare global {
  interface Window {
    log: (message: string) => void;
  }
}

window.log = (message: string) => {
  const logs = document.getElementById("logs");
  if (!logs) return;
  if (logs.children.length > 10) logs.removeChild(logs.children[0]);
  if (logs) {
    const li = document.createElement("li");
    li.textContent = message;
    logs.appendChild(li);
    if (message.includes("ABC")) li.classList.add("text-info");
  }
  for (let i = 0; i < logs.children.length; i++) {
    const li = logs.children[i] as HTMLLIElement;
    li.style.opacity = `${((i + 12 - logs.children.length) / 10) ** 0.9}`;
  }
};
