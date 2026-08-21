import {
    generateUploadButton,
    generateUploadDropzone,
    generateVueHelpers,
    type GenerateTypedHelpersOptions
} from "@uploadthing/vue";

const runtimeConfig = useRuntimeConfig();

const initOpts = {
    url: runtimeConfig.apiBaseUrl
} satisfies GenerateTypedHelpersOptions;

// export const UploadButton = generateUploadButton<OurFileRouter>(initOpts);
// export const UploadDropzone = generateUploadDropzone<OurFileRouter>(initOpts);

// export const { useUploadThing } = generateVueHelpers<OurFileRouter>(initOpts);
