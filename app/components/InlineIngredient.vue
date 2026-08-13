<script setup lang="ts">
import { ArrowLeftRightIcon, ChartPieIcon, InfoIcon } from "@lucide/vue";
import type { Ingredient } from "../utils/models/recipe";
import IngredientTooltip from "./IngredientTooltip.vue";

interface Props {
    ingredient: Ingredient;
    quantityOverride?: number | null;
    unitOverride?: string | null;
}

const props = defineProps<Props>();

const isFullAmountUsedInRecipe = !Boolean(props.quantityOverride)
const hasTooltip: ComputedRef<boolean> = computed(() =>
    Boolean(props.ingredient.longNote || props.ingredient.substitutions.length)
);

const {
    ingredientContainerRefName,
    tooltipComponentRefName,
    handleMouseEnter,
    handleMouseLeave
} = useAdaptiveTooltip();
</script>

<template>
    <div class="ingredient-inline-container" :ref="ingredientContainerRefName">
        <span
            class="ingredient-inline-wrapper"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <span class="ingredient-inline">{{
                quantityOverride
                    ? ingredient.toAbbreviatedStringWithOverrides(quantityOverride, unitOverride ?? undefined)
                    : ingredient.toAbbreviatedString()
            }}</span>
            <span class="ingredient-inline-note" v-if="ingredient.inlineNote"> ({{ ingredient.inlineNote }})</span>
            <ChartPieIcon v-if="!isFullAmountUsedInRecipe" class="icon-inline" />
            <ArrowLeftRightIcon v-if="ingredient.substitutions.length" class="icon-inline" />
            <InfoIcon v-if="ingredient.longNote" class="icon-inline" />
        </span>
        <IngredientTooltip
            :v-if="hasTooltip"
            :ingredient="ingredient"
            :isFullAmountUsedInRecipe="isFullAmountUsedInRecipe"
            :ref="tooltipComponentRefName" />
    </div>
</template>

<style scoped>
.ingredient-inline-container {
    position: relative;
    display: inline-block;
}

.ingredient-inline-wrapper {
    display: inline-block;
}

/* Only give the dashed underline to ingredients with tooltips */
:has(.ingredient-tooltip) > .ingredient-inline-wrapper {
    cursor: pointer;
    border-bottom: 2px dashed var(--soft-periwinkle);
}

.ingredient-inline-note {
    color: var(--ingredient-inline-note-color);
    font-weight: 600;
}

.icon-inline {
    margin-left: 5px;
    color: var(--soft-periwinkle);
}
</style>
