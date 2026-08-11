<script setup lang="ts">
import { ChartPieIcon, CircleCheckBigIcon } from "@lucide/vue";
import type { Ingredient } from "../utils/models/recipe";
import IngredientTooltip from "./IngredientTooltip.vue";

interface Props {
    ingredient: Ingredient;
    quantityOverride?: number | null;
    unitOverride?: string | null;
    isFullAmountUsedInRecipe?: boolean;
}

withDefaults(defineProps<Props>(), {isFullAmountUsedInRecipe: true});
</script>

<template>
    <div class="ingredient-inline-container">
        <span class="ingredient-inline-wrapper">
            <span class="ingredient-inline">{{ quantityOverride ? ingredient.toAbbreviatedStringWithOverrides(quantityOverride, unitOverride ?? undefined) : ingredient.toAbbreviatedString() }}</span>
            <!-- <CircleCheckBigIcon v-if="isFullAmountUsedInRecipe" class="icon-inline" />
            <ChartPieIcon v-else class="icon-inline" /> -->
        </span>
        <IngredientTooltip :ingredient="ingredient" :isFullAmountUsedInRecipe="isFullAmountUsedInRecipe" />
    </div>
</template>

<style scoped>
.ingredient-inline-container {
    position: relative;
    display: inline-block;
}

.ingredient-inline-wrapper {
    display: inline-block;
    cursor: pointer;
}

.ingredient-inline {
    /* color: var(--strawberry-red); */
    border-bottom: 2px dashed var(--soft-periwinkle);
    /* margin-right: 5px; */
}
</style>
