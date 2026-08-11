<script setup lang="ts">
import type { Ingredient } from "~/utils/models/recipe";
import { CircleCheckBigIcon, ChartPieIcon } from "@lucide/vue";

interface Props {
    isFullAmountUsedInRecipe?: boolean;
    ingredient: Ingredient;
}

defineProps<Props>();
</script>

<template>
    <div class="ingredient-tooltip">
        <p v-if="isFullAmountUsedInRecipe">
            <CircleCheckBigIcon class="icon-inline" />This is all of the {{ ingredient.name }} listed in the ingredients
            list.
        </p>
        <!-- Only show this tooltip if isFullAmountUsedInRecipe is explicitly defined as false; ignore other falsy values -->
        <p
            v-else-if="
                isFullAmountUsedInRecipe !== null &&
                isFullAmountUsedInRecipe !== undefined &&
                isFullAmountUsedInRecipe === false
            ">
            <ChartPieIcon class="icon-inline" />This is just a portion of the full amount of
            {{ ingredient.name }} listed in the ingredients list.
        </p>
        <!-- <hr v-if="ingredient.substitutions.length" /> -->
        <h3 v-if="ingredient.substitutions.length">Substitute for:</h3>
        <div v-for="(substitution, index) in ingredient.substitutions" class="substitution">
            <p v-for="substitutionIngredient in substitution">
                {{ substitutionIngredient.toString() }}
            </p>
            <!-- Don't show "---- or ----" separator after last substitution -->
            <p v-if="index < ingredient.substitutions.length - 1" class="substitution-separator">or</p>
        </div>
    </div>
</template>

<style scoped>
.ingredient-tooltip {
    display: none;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 100%;
    margin-left: 5px;
    width: 20rem;
    box-shadow: 0px 0px 5px var(--box-shadow-color);
    padding: 1rem;
    border-radius: 1rem;
    background-color: var(--background-color);
}

.ingredient-tooltip .icon-inline {
    margin-right: 5px;
}

.ingredient-inline-wrapper:hover + .ingredient-tooltip {
    display: block;
}

.substitution-separator {
    display: flex;
    align-items: center;
    text-align: center;
}

.substitution-separator::before,
.substitution-separator::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid var(--text-color);
}

.substitution-separator::before {
    margin-right: 0.25em;
}

.substitution-separator::after {
    margin-left: 0.25em;
}

p {
    margin: 0px;
}
</style>
