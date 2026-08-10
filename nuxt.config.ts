// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    runtimeConfig: {
        apiBaseUrl: "api.recipes.hpbelmont.com"
    },
    postcss: {
        plugins: {
            autoprefixer: {},
            "@csstools/postcss-global-data": {
                files: [
                    "./app/assets/styles/global-variables.css" // File containing your @custom-media definitions
                ]
            },
            "postcss-custom-media": {}
        }
    }
});
