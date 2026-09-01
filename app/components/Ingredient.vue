<script setup lang="ts">
import { ArrowLeftRightIcon, ChartPieIcon, InfoIcon } from "@lucide/vue";
import type { UUID } from "crypto";
import type { Ingredient, InlineIngredient } from "../utils/models/recipe/recipe.ts";
import IngredientTooltip from "./IngredientTooltip.vue";

interface Props {
    ingredient: Ingredient | InlineIngredient;
    inline?: boolean;
    withChunk?: boolean;
    getIngredientFromMap?: (id: UUID) => Ingredient | undefined;
}

const props = defineProps<Props>();

const ingredientValue = computed(() => {
    if (props.withChunk && props.getIngredientFromMap !== undefined) {
        const ingredientFromMap = props.getIngredientFromMap!((props.ingredient as InlineIngredient).id as UUID);
        if (!ingredientFromMap) {
            throw new Error("Couldn't get an ingredient by ID.");
        }
        return ingredientFromMap;
    }
    if (!props.withChunk) {
        return props.ingredient as Ingredient;
    }
    throw new Error("Couldn't resolve an ingredient.");
});

const quantityOverride = computed(() => {
    // Non-inline ingredients always use the original quantity from ingredientValue.
    if (!props.inline || !props.withChunk) {
        return undefined;
    }
    // The quantity from the ingredient JSON takes precedence over the quantity in ingredientValue.
    // Casting here is for readability & isn't needed at compile time.
    return (props.ingredient as InlineIngredient).quantity;
});

const unitOverride = computed(() => {
    // Non-inline ingredients always use the original unit from ingredientValue.
    if (!props.inline || !props.withChunk) {
        return undefined;
    }
    // The unit from the ingredient JSON takes precedence over the unit in ingredientValue.
    // Casting here is for readability & isn't needed at compile time.
    return (props.ingredient as InlineIngredient).unit;
});

const ingredientString = computed(() => {
    if (quantityOverride.value) {
        return ingredientValue.value.toAbbreviatedStringWithOverrides(
            quantityOverride.value,
            unitOverride.value ?? undefined
        );
    }
    if (props.inline) {
        return ingredientValue.value.toAbbreviatedString();
    }
    return ingredientValue.value.toString();
});

const isFullAmountUsedInRecipe = computed(() => (props.inline ? !Boolean(quantityOverride.value) : undefined));

const hasTooltip = computed(() =>
    Boolean(props.inline || ingredientValue.value.longNote || ingredientValue.value.substitutions.length)
);

const { ingredientContainerRefName, tooltipComponentRefName, handleMouseEnter, handleMouseLeave } = useAdaptiveTooltip(
    hasTooltip.value
);
</script>

<template>
    <div class="ingredient-container" :ref="ingredientContainerRefName">
        <span class="ingredient-wrapper" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
            <span class="ingredient">{{ ingredientString }}</span>
            <!-- The existing formatting here is very important for preserving whitespace. -->
            <!-- prettier-ignore -->
            <span class="ingredient-inline-note" v-if="ingredientValue.inlineNote"> ({{ ingredientValue.inlineNote }})</span>
            <ChartPieIcon v-if="inline && !isFullAmountUsedInRecipe" class="icon-inline" />
            <ArrowLeftRightIcon v-if="ingredientValue.substitutions.length" class="icon-inline" />
            <InfoIcon class="icon-inline note-icon" v-if="ingredientValue.longNote" />
        </span>
        <IngredientTooltip
            v-if="hasTooltip"
            :ingredient="ingredientValue"
            :is-full-amount-used-in-recipe="isFullAmountUsedInRecipe"
            :handle-mouse-enter="handleMouseEnter"
            :handle-mouse-leave="handleMouseLeave"
            :ref="tooltipComponentRefName" />
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

/* Dashed underline indicates that the ingredient has a tooltip */
:has(.ingredient-tooltip) > .ingredient-wrapper {
    cursor: pointer;
    text-decoration: underline dashed;
    text-decoration-color: var(--soft-periwinkle);
    text-decoration-thickness: 2px;
    text-underline-offset: 0.25em;
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
