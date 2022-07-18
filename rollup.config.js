import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/static/js/script.js",
  output: {
    file: "src/static/dist/js/bundle.js",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    resolve(), // tells Rollup how to find date-fns in node_modules
    production && terser(), // minify, but only in production
  ],
};
