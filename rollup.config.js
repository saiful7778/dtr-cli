import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: {
    file: "build/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    resolve({
      preferBuiltins: true,
      extensions: [".ts"],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
  external: [...Object.keys(pkg.dependencies || {})],
};
