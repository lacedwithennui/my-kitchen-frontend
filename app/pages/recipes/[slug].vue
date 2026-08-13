<script setup lang="ts">
import type { UUID } from "crypto";
import IngredientComponent from "~/components/Ingredient.vue";
import { Recipe, type IngredientChunk, type LinkChunk, type RecipeJSON } from "~/utils/models/recipe";

const recipeSlug = useRoute().params.slug;
const recipeJSON = await import(`../../utils/models/${recipeSlug}.json`).catch(() => {
    throw createError({ status: 404, fatal: true });
});
// @!ts-expect-error
const recipe = Recipe.fromJSON(recipeJSON as RecipeJSON);
const ingredientMap = computed(() => new Map(recipe.ingredients.map((ingredient) => [ingredient.id, ingredient])));

useHead({ title: `${recipe.name} Recipe | Hazel's Kitchen` });
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
                    <IngredientComponent :ingredient="ingredient" />
                </li>
            </ul>
        </section>
        <section class="instructions">
            <h2>Instructions</h2>
            <ol>
                <li v-for="instruction in recipe.instructions">
                    <template v-for="chunk in instruction">
                        <template v-if="chunk.type === 'text'">{{ chunk.content }}</template>

                        <InlineIngredient
                            v-if="chunk.type === 'ingredient'"
                            :ingredient="
                                ingredientMap.get((chunk as IngredientChunk).content.id as UUID)!
                            "></InlineIngredient>

                        <template
                            v-else-if="chunk.type === 'ingredientChain'"
                            v-for="(inlineIngredient, index) in chunk.content">
                            <!-- This enforces a "foo, bar, and baz" (oxford comma) format -->
                            <InlineIngredient
                                :ingredient="ingredientMap.get(inlineIngredient.id as UUID)!"
                                :quantity-override="inlineIngredient.quantity"
                                :unit-override="inlineIngredient.unit"
                                :is-full-amount-used-in-recipe="!Object.hasOwn(inlineIngredient, 'quantity')" />
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
