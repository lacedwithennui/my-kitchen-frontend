import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postCssCustomMedia from "postcss-custom-media";
import autoprefixer from "autoprefixer";
import postcssGlobalData from "@csstools/postcss-global-data";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        postcss: {
            plugins: [
                autoprefixer(),
                postcssGlobalData({
                    files: [
                        "./src/assets/styles/global-variables.css" // File containing your @custom-media definitions
                    ]
                }),
                postCssCustomMedia()
            ]
        }
    }
});
