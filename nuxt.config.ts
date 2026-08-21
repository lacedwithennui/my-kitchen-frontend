// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    modules: ["@nuxt/image"],
    devtools: { enabled: true },
    runtimeConfig: {
        apiBaseUrl: "api.recipes.hpbelmont.com"
    },
    postcss: {
        plugins: {
            autoprefixer: {},
            "@csstools/postcss-global-data": {
                files: ["./app/assets/styles/global-variables.css"]
            },
            "postcss-custom-media": {}
        }
    },
    nitro: {
        prerender: {
            routes: ["/recipes/birria-beef"]
        }
    },
    image: {
        domains: ["ufs.sh"]
    },
    app: {
        head: {
            titleTemplate: "%s %separator Hazel's Kitchen",
            templateParams: {
                separator: "|"
            }
        }
    }
});
