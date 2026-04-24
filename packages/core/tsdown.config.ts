import { defineConfig } from "tsdown";
import Vue from "unplugin-vue/rolldown";
import VueJsx from "unplugin-vue-jsx/rolldown";

export default defineConfig({
  entry: "src/index.ts",
  format: ["esm", "cjs"],
  platform: "neutral",
  dts: { vue: true },
  clean: true,
  exports: true,
  plugins: [Vue({ isProduction: true }), VueJsx()],
});
