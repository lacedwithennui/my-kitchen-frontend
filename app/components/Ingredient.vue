<script setup lang="ts">
import { ChartPieIcon, CircleCheckBigIcon, InfoIcon, ArrowLeftRightIcon } from "@lucide/vue";
import type { Ingredient } from "../utils/models/recipe";
import IngredientTooltip from "./IngredientTooltip.vue";

interface Props {
    ingredient: Ingredient;
    quantityOverride?: number | null;
    unitOverride?: string | null;
    isFullAmountUsedInRecipe?: boolean;
}

/*
 * We need to be able to tell the difference between an explicit false and an omitted prop, so make the default
 * undefined instead of letting Vue coerce a false
 */
const props = withDefaults(defineProps<Props>(), { isFullAmountUsedInRecipe: undefined });

const hasTooltip: ComputedRef<boolean> = computed(() =>
    Boolean(props.ingredient.longNote || props.ingredient.substitutions.length)
);

// Don't import the tooltip composable logic unless we need it
const {
    ingredientContainerRefName,
    tooltipComponentRefName,
    handleMouseEnter,
    handleMouseLeave
} = hasTooltip.value ? useAdaptiveTooltip() : {};
</script>

<template>
    <div class="ingredient-container" :ref="ingredientContainerRefName">
        <!-- Conditionally bind event listeners (don't add tooltip listeners if there's no tooltip) -->
        <!-- Prettier formats the v-on block in a less-readable way. -->
        <!-- prettier-ignore -->
        <span
            class="ingredient-wrapper"
            v-on="
                hasTooltip ? {
                    mouseenter: handleMouseEnter,
                    mouseleave: handleMouseLeave
                } : {}
            "            >
            <span class="ingredient">{{ ingredient.toString() }}</span>
            <span class="ingredient-inline-note" v-if="ingredient.inlineNote"> ({{ ingredient.inlineNote }})</span>
            <ArrowLeftRightIcon v-if="ingredient.substitutions.length" class="icon-inline" />
            <InfoIcon class="icon-inline note-icon" v-if="ingredient.longNote" />
        </span>
        <IngredientTooltip v-if="hasTooltip" :ingredient="ingredient" :ref="tooltipComponentRefName" />
    </div>
</template>

<style scoped>
.ingredient-container {
    position: relative;
    display: inline-block;
}

.ingredient-wrapper {
    display: inline-block;
}

/* Only give the dashed underline to ingredients with tooltips */
:has(.ingredient-tooltip) > .ingredient-wrapper {
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
