<script setup lang="ts">
import type { CitationList } from "../utils/models/shared/citation";

interface Props {
    citationList: CitationList;
}

defineProps<Props>();
</script>

<template>
    <section>
        <h2>Bibliography</h2>
        <ol>
            <li
                v-for="citation in citationList"
                :id="`bibliography-citation-${citation.displayIndex}`"
                class="citation">
                <a :href="citation.href"><cite>{{ citation.displayText }}</cite></a>
            </li>
        </ol>
    </section>
</template>

<style scoped>
.citation {
    transition: background-color 0.5s ease-out;
}
.highlighted {
    background-color: #ffdc13cc;
}
</style>
