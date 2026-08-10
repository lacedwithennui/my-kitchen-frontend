<script setup lang="ts">
import { ChartPieIcon, CircleCheckBigIcon } from "@lucide/vue";
import type { Ingredient } from "../scripts/objects/recipe";

interface Props {
    ingredient: Ingredient;
}

const props = defineProps<Props>();
const { name, quantity, unit, substitutions, isFullAmountUsedInRecipe } = props.ingredient;
const fullAmount = isFullAmountUsedInRecipe ?? true;
</script>
<template>
    <div class="ingredient-inline-container">
        <span class="ingredient-inline-wrapper">
            <span class="ingredient-inline">{{ ingredient.toString() }}</span>
            <CircleCheckBigIcon v-if="fullAmount" class="icon-inline" />
            <ChartPieIcon v-else class="icon-inline" />
        </span>
        <div class="ingredient-tooltip">
            <p v-if="fullAmount"><CircleCheckBigIcon class="icon-inline" />This is all of the {{ ingredient.name }} listed in the ingredients list.</p>
            <p v-else><ChartPieIcon class="icon-inline" />This is just a portion of the full amount of this ingredient listed in the ingredients list.</p>
            <br v-if="substitutions.length" />
            <h3 v-if="substitutions.length">Substitute for:</h3>
            <div v-for="(substitution, index) in substitutions" class="substitution">
                <p v-for="substitutionIngredientString in substitution.getScaledSubstitutionIngredientStrings()">
                    {{ substitutionIngredientString }}
                </p>
                <!-- Don't show "---- or ----" separator after last substitution -->
                <p v-if="index < substitutions.length - 1" class="substitution-separator">or</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.ingredient-inline-container {
    position: relative;
    display: inline-block;
}

.ingredient-inline-wrapper {
    display: inline-block;
    /* height: 1em; */
    cursor: pointer;
}

.ingredient-inline {
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
