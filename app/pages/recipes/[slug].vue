<script setup lang="ts">
import type { UUID } from "crypto";
import Ingredient from "../../components/Ingredient.vue";
import { Recipe, type RecipeJSON } from "../../utils/models/recipe/recipe.ts";
import type { LinkChunk } from "../../utils/models/shared/ast.ts";

const recipeSlug = useRoute().params.slug;
const recipeJSON = await import(`../../utils/models/recipe-json/${recipeSlug}.json`).catch(() => {
    throw createError({ status: 404, fatal: true });
});
const recipe = Recipe.fromJSON(recipeJSON as RecipeJSON);
const ingredientMap = computed(() => new Map(recipe.ingredients.map((ingredient) => [ingredient.id, ingredient])));
const getIngredientFromMap = (id: UUID) => ingredientMap.value.get(id);

useHead({ title: `${recipe.name} Recipe` });
</script>

<template>
    <main class="content content-width">
        <Hero v-if="recipe.thumbnailURL" :src="recipe.thumbnailURL.toString()">{{ recipe.name }}</Hero>
        <h1 v-else>{{ recipe.name }}</h1>
        <p class="description">{{ recipe.description }}</p>
        <section class="ingredients">
            <h2>Ingredients</h2>
            <ul>
                <li v-for="ingredient in recipe.ingredients">
                    <Ingredient :ingredient="ingredient" />
                </li>
            </ul>
        </section>
        <section class="instructions">
            <h2>Instructions</h2>
            <ol>
                <li v-for="instruction in recipe.instructions">
                    <template v-for="chunk in instruction">
                        <template v-if="chunk.type === 'text'">{{ chunk.content }}</template>

                        <Ingredient
                            v-if="chunk.type === 'ingredient'"
                            :ingredient="chunk.content"
                            :get-ingredient-from-map="getIngredientFromMap"
                            with-chunk
                            inline />

                        <template
                            v-else-if="chunk.type === 'ingredientChain'"
                            v-for="(ingredient, index) in chunk.content">
                            <!-- This enforces a "foo, bar, and baz" (oxford comma) format -->
                            <Ingredient
                                :ingredient="ingredient"
                                :get-ingredient-from-map="getIngredientFromMap"
                                with-chunk
                                inline />
                            <template v-if="index < chunk.content.length - 1 && chunk.content.length > 2">, </template>
                            <template v-if="index < chunk.content.length - 1 && chunk.content.length === 2">{{
                                " "
                            }}</template>
                            <template v-if="index === chunk.content.length - 2">and </template>
                        </template>

                        <NuxtLink v-else-if="chunk.type === 'localLink'" :href="(chunk as LinkChunk).href">{{
                            chunk.content
                        }}</NuxtLink>

                        <a v-else-if="chunk.type === 'externalLink'" :href="(chunk as LinkChunk).href">{{
                            chunk.content
                        }}</a>
                    </template>
                </li>
            </ol>
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
