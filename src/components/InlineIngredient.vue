<script setup lang="ts">
import { ChartPieIcon, CircleCheckBigIcon } from "@lucide/vue";

interface Props {
    fullAmount?: boolean;
}

const props = withDefaults(defineProps<Props>(), { fullAmount: true });
</script>
<template>
    <span class="ingredient-inline-wrapper">
        <span class="ingredient-inline"><slot></slot></span>
        <CircleCheckBigIcon v-if="fullAmount" class="icon-inline" />
        <ChartPieIcon v-else class="icon-inline" />
    </span>
    <div class="ingredient-tooltip">
        Hello World
    </div>
</template>

<style scoped>

.ingredient-inline-wrapper {
    display: inline-block;
    height: 1em;
}

.ingredient-inline {
    color: var(--sunflower-gold);
    border-bottom: 2px dashed var(--sunflower-gold);
    margin-right: 5px;
}

.ingredient-tooltip {
    display: none;
}

.ingredient-inline-wrapper:hover + .ingredient-tooltip {
    display: block;
    position: relative;
    z-index: 10;
    /* top: -1em; */
    top: 0;
}
</style>