<script setup lang="ts">
interface Props {
    src: string;
    alt?: string;
}

defineProps<Props>();
</script>

<template>
    <div class="hero">
        <img :src="src" :alt="alt" />
        <h1 v-if="$slots.default">
            <slot></slot>
        </h1>
    </div>
</template>

<style scoped>
.hero {
    aspect-ratio: 16 / 9;
    width: 100%;
    height: auto;
    position: relative;
    margin-block: 1rem;
}

img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

h1 {
    color: var(--light);
    text-shadow: 4px 4px 5px var(--text-shadow-color);
    position: absolute;
    bottom: 0px;
    margin: 1rem;
    line-height: 1;
    font-size: 4rem;
}
</style>
