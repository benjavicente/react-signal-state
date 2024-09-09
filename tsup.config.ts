import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/api/index.ts", "src/api/store.ts"],
  splitting: true,
  sourcemap: false,
  clean: true,
  format: ["esm", "cjs"],
  minify: true,
  tsconfig: "tsconfig.app.json",
  dts: {
    resolve: true,
    entry: ["src/api/index.ts", "src/api/store.ts"],
    compilerOptions: {
      jsx: "react-jsx",
      moduleResolution: "node",
    },
  },
  external: ["react", "react-dom", "react/jsx-runtime", "@preact/signals-core"],
});
