<script setup lang="ts">
import { ArrowLeftRightIcon, ChartPieIcon, CircleCheckBigIcon, InfoIcon } from "@lucide/vue";
import type { Ingredient } from "../utils/models/recipe";

interface Props {
    ingredient: Ingredient;
    isFullAmountUsedInRecipe?: boolean;
    handleMouseEnter?: () => void;
    handleMouseLeave?: () => void;
}

const tooltipRef = useTemplateRef<HTMLDivElement>("ingredient-tooltip");

defineExpose({ tooltipRef });

/*
 * We need to be able to tell the difference between an explicit false and an omitted prop, so make the default
 * undefined instead of letting Vue coerce a false
 */
withDefaults(defineProps<Props>(), { isFullAmountUsedInRecipe: undefined });
</script>

<template>
    <div
        class="ingredient-tooltip"
        ref="ingredient-tooltip"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <p v-if="isFullAmountUsedInRecipe">
            <CircleCheckBigIcon class="icon-inline" />This is all of the {{ ingredient.name }} listed in the ingredients
            list.
        </p>
        <!-- Ignore other falsy values like undefined -->
        <p v-else-if="isFullAmountUsedInRecipe === false">
            <ChartPieIcon class="icon-inline" />This is just a portion of the full amount of
            {{ ingredient.name }} listed in the ingredients list.
        </p>

        <p v-if="ingredient.longNote"><InfoIcon class="icon-inline" />{{ ingredient.longNote }}</p>

        <p v-if="ingredient.substitutions.length" class="substitutions-header">
            <ArrowLeftRightIcon class="icon-inline" />Substitute for:
        </p>
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
p {
    margin: 0px;
}

.ingredient-tooltip {
    position: absolute;
    z-index: var(--high-z-index);
    top: 0px;
    left: calc(100% + 5px);
    width: 20rem;
    max-width: calc(100vw - 2 * var(--minimum-margin));
    box-shadow: 0px 0px 5px var(--box-shadow-color);
    padding: 1rem;
    border-radius: 1rem;
    background-color: var(--background-color);
    visibility: hidden;
}

.ingredient-tooltip.left-of-inline {
    top: 0px;
    left: unset;
    right: calc(100% + 5px);
}

.ingredient-tooltip.centered-on-screen {
    top: unset;
    left: 50vw;
    transform: translateX(-50%);
}

.ingredient-tooltip:not(.left-of-inline, .centered-on-screen).above-inline {
    top: 100%;
    transform: translateY(-100%);
}

.ingredient-tooltip.left-of-inline.above-inline {
    top: unset;
    bottom: 0px;
}

/* 
 * If this selector is satisfied, then position on the container will be static, so we can't rely on absolute
 * positioning rules relative to the ingredient wrapper.
 */
.ingredient-tooltip.centered-on-screen.above-inline {
    margin-top: calc(-1em * var(--line-height));
    transform: translate(-50%, -100%);
}

.ingredient-tooltip .icon-inline {
    margin-right: 5px;
    color: var(--text-color);
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
