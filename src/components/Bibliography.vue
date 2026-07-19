<script setup lang="ts">
import type { CitationList } from '../scripts/types/citation';

interface Props {
    citationList: CitationList;
}

defineProps<Props>()
</script>

<template>
    <section>
        <h2>Bibliography</h2>
        <ol>
            <li v-for="citation in citationList" :id="`bibliography-citation-${citation.displayIndex}`">
                <a :href="citation.href"><cite>{{ citation.displayText }}</cite></a>
            </li>
        </ol>
    </section>
</template>