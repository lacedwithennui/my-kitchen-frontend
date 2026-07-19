<script setup lang="ts">
import { ChartPieIcon } from "@lucide/vue";
import { ref } from "vue";
import Bibliography from "../components/Bibliography.vue";
import InlineCitation from "../components/InlineCitation.vue";
import type { CitationList } from "../scripts/types/citation.ts";

const citationList = ref<CitationList>({});
const lastCitationDisplayIndex = ref(0);

const addToCitationList = (href: string, displayText: string) => {
    if (!Object.hasOwn(citationList.value, href)) {
        citationList.value[href] = {
            href,
            displayText,
            displayIndex: ++lastCitationDisplayIndex.value
        };
    }
    return lastCitationDisplayIndex.value;
};
</script>

<template>
    <main class="content content-width">
        <h1 class="page-title">About</h1>
        <section>
            <h2>Hazel's Kitchen</h2>
            <p>
                Sources like YouTube, Instagram, and TikTok have started to replace cookbooks and recipe sites.
                According to a study of 2,000 adults, less than half of home cooks use traditional cookbooks
                <InlineCitation
                    href="https://www.the-independent.com/tech/recipes-online-cookbooks-food-inspiration-social-media-facebook-instagram-b1397624.html"
                    displayText="More than 70% of adults use social media for recipes instead of cookbooks, survey finds"
                    :add-to-list-callback="addToCitationList"
                    :citation-list="citationList" />. Recently, I found <em>myself</em> turning to TikTok and Instagram
                when I needed new dinner ideas. Why worry about the counterspace a cookbook takes up, the mystery budget
                required for each recipe, or misunderstanding the weird wording describing archaic cooking techniques?
                Short-form video recipes allow you to see the process from start to finish with visible steps, and they
                have the added benefit of going wherever you go. No need to wait until you're home to check what
                groceries you need to buy for dinner tonight. But how can we make that experience better?
            </p>
        </section>
        <section>
            <h2>What Makes This Site Special</h2>
            <p>
                Using Hazel's Kitchen, you'll have access to seldom-seen features that modern-day recipe websites and
                video cooking guides don't use. All of these come from issues I've encountered reading recipes in my own
                kitchen, and I'm confident they'll help you, too:
            </p>
            <ul>
                <li>
                    <strong>Better Ingredient Lists</strong> - Why do all recipe sites and cookbooks insist on
                    separating the ingredients list from the instructions? Recipes from Hazel's Kitchen show the
                    ingredients and their amounts both in the ingredient list <em>and</em> the instructions. Not only
                    that, but the <CircleCheckBigIcon class="icon-inline" /> and <ChartPieIcon class="icon-inline" /> icons
                    will tell you when you're using all of an ingredient in a given step, or just a portion of the whole
                    amount used in the recipe.
                </li>
            </ul>
        </section>
        <Bibliography :citation-list="citationList" />
    </main>
</template>
