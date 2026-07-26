<script setup lang="ts">
import InlineIngredient from "../components/InlineIngredient.vue";
import { Ingredient, Substitution } from "../scripts/objects/recipe.ts";

const ingredient1 = new Ingredient(
    "Beef broth",
    2,
    "Cups",
    [
        new Substitution(crypto.randomUUID(), new Ingredient("Beef broth", 1, "Cup"), [
            new Ingredient("Better than Bullion (Beef)", 1, "Tsp"),
            new Ingredient("Hot water", 1, "Cup")
        ], 2),
        new Substitution(crypto.randomUUID(), new Ingredient("Beef broth", 1, "Cup"), [new Ingredient("Beef stock", 1, "Cup")], 2)
    ],
    true
);
</script>

<template>

    <main class="content content-width">
        <img src="" />

        <InlineIngredient :ingredient="ingredient1" />
    </main>
</template>
