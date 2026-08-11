<script setup lang="ts">
import { ChartPieIcon, CircleCheckBigIcon, InfoIcon } from "@lucide/vue";
import type { Ingredient } from "../utils/models/recipe";
import IngredientTooltip from "./IngredientTooltip.vue";

interface Props {
    ingredient: Ingredient;
}

defineProps<Props>();
</script>

<template>
    <div class="ingredient-container">
        <span class="ingredient-wrapper">
            <span class="ingredient">{{ ingredient.toString() }}</span>
            <InfoIcon v-if="ingredient.note" />
        </span>
        <IngredientTooltip :ingredient="ingredient" />
    </div>
</template>

<style scoped>
.ingredient-container {
    position: relative;
    display: inline-block;
}

.ingredient-wrapper {
    display: inline-block;
    cursor: pointer;
}

.ingredient {
    color: var(--sunflower-gold);
    border-bottom: 2px dashed var(--sunflower-gold);
    margin-right: 5px;
}

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
</style>
