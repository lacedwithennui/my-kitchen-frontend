<script setup lang="ts">
import { BlogPost, type BlogPostJSON } from "../../utils/models/blog/blog.ts";
import type { LinkChunk } from "../../utils/models/shared/ast.ts";

const blogPostSlug = useRoute().params.slug;
const blogPostJSON = await import(`../../utils/models/blog-post-json/${blogPostSlug}.json`).catch(() => {
    throw createError({ status: 404, fatal: true });
});
const blogPost = BlogPost.fromJSON(blogPostJSON as BlogPostJSON);

useHead({ title: blogPost.name });
</script>

<template>
    <main class="content content-width">
        <Hero v-if="blogPost.thumbnailURL" :src="blogPost.thumbnailURL.toString()">{{ blogPost.name }}</Hero>
        <h1 v-else>{{ blogPost.name }}</h1>
        <p class="description">{{ blogPost.description }}</p>
        <section class="post-content">
            <template v-for="chunk in blogPost.content">
                <template v-if="chunk.type === 'text'">{{ chunk.content }}</template>

                <NuxtLink v-else-if="chunk.type === 'localLink'" :href="(chunk as LinkChunk).href">{{
                    chunk.content
                }}</NuxtLink>

                <a v-else-if="chunk.type === 'externalLink'" :href="(chunk as LinkChunk).href">{{ chunk.content }}</a>
            </template>
        </section>
    </main>
</template>

<style>
.instructions li {
    margin-bottom: 0.5em;
}

.instructions li::marker {
    font-weight: bold;
}
</style>
