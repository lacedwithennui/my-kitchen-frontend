<script setup lang="ts">
import { computed, onMounted, onUnmounted, onUpdated } from "vue";
import type { CitationList } from "../utils/models/shared/citation";
interface Props {
    href: string;
    displayText: string;
    citationList?: CitationList;
    addToListCallback: (href: string, displayText: string) => {};
    highlightBibliographyEntryCallback?: Function;
}

const props = withDefaults(defineProps<Props>(), { highlightBibliographyEntryCallback: () => {} });
const displayIndex = computed(() => props.citationList?.[props.href]?.displayIndex ?? "*");
const bibliographyLocation = computed(() => `#bibliography-citation-${displayIndex.value}`);
let highlightTimeoutId: number;
const highlightBibliographyEntry = () => {
    highlightTimeoutId = props.highlightBibliographyEntryCallback(props.href, highlightTimeoutId);
};

onMounted(() => props.addToListCallback(props.href, props.displayText));
onUpdated(() => props.addToListCallback(props.href, props.displayText));
onUnmounted(() => clearTimeout(highlightTimeoutId));
</script>

<template>
    <sup>
        <a :href="bibliographyLocation" @click="highlightBibliographyEntry">{{ displayIndex }}</a>
    </sup>
</template>
