<script setup lang="ts">
import { computed, onMounted } from "vue";
import type { CitationList } from "../scripts/types/citation";
interface Props {
    href: string;
    displayText: string;
    citationList?: CitationList;
    addToListCallback: Function;
}

const props = defineProps<Props>();
const displayIndex = computed(() => props.citationList?.[props.href]?.displayIndex ?? "*");
const bibliographyLocation = computed(() => `#bibliography-citation-${displayIndex.value}`)

onMounted(() => props.addToListCallback(props.href, props.displayText));
</script>

<template>
    <sup>
        <a :href="bibliographyLocation">{{ displayIndex }}</a>
    </sup>
</template>
