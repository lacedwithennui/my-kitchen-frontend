<script setup lang="ts">
import { CircleCheckBigIcon, ChartPieIcon, ArrowLeftRightIcon } from "@lucide/vue";
import Bibliography from "../../components/Bibliography.vue";
import InlineCitation from "../../components/InlineCitation.vue";
import { useInlineCitations } from "../../composables/useInlineCitations.ts";

const { citationList, addToCitationList, highlightBibliographyEntry } = useInlineCitations();

useHead({ title: "About" });
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
                    :citation-list="citationList"
                    :add-to-list-callback="addToCitationList"
                    :highlight-bibliography-entry-callback="highlightBibliographyEntry" />. Recently, I found
                <em>myself</em> turning to TikTok and Instagram when I needed new dinner ideas. Why worry about the
                counterspace a cookbook takes up, the mystery budget required for each recipe, or misunderstanding the
                weird wording describing archaic cooking techniques? Short-form video recipes allow you to see the
                process from start to finish with visible steps, and they have the added benefit of going wherever you
                go. No need to wait until you're home to check what groceries you need to buy for dinner tonight. But
                how can we make that experience even better?
            </p>
            <p>
                <b>Hazel's Kitchen is my passion project</b>, blending the cooking experience I built growing up with
                the love I hold for software engineering and frontend development. Admittedly, it's also born out of my
                disdain for today's ad-riddled recipe websites which prioritize stories and SEO over readability and
                mobile users. Since I'm not in it for the money, I am completely comfortable pouring myself into this
                project to make it <b>the recipe website that home cooks of all skill levels deserve</b>.
            </p>
        </section>
        <section>
            <h2>What Makes This Site Special</h2>
            <p>
                Using Hazel's Kitchen, you'll have access to seldom-seen features that modern-day recipe websites and
                video cooking guides will never give you for free. All of these come from issues I've encountered
                reading recipes in my own kitchen, and I'm confident they'll help you, too:
            </p>
            <section>
                <h3>Better Ingredient Lists</h3>
                <p>
                    Why do all recipe sites and cookbooks insist on separating the ingredients list from the
                    instructions? Recipes from Hazel's Kitchen show the ingredients and their amounts both in the
                    ingredient list <em>and</em> the instructions. Not only that, but the
                    <ChartPieIcon class="icon-inline" /> icon will tell you when you're using just a portion of the
                    whole amount used in the recipe, so you don't accidentally toss in all the salt in step 3 when you
                    need some in step 5.
                </p>
            </section>
            <section>
                <h3>Ingredient Substitutions</h3>
                <p>
                    Sometimes you don't have the same things in your kitchen that I do. Sometimes you can't find
                    buttermilk at the store. Sometimes you start cooking and you realize you didn't buy ground turkey.
                    None of those should be the reason you don't try a delicious dish or miss out on your favorite
                    dinner. The <ArrowLeftRightIcon class="icon-inline" /> icon will show you if there's an easy
                    substitution I recommend for any ingredients in the recipe.
                    <!-- There's also a convenient collection of
                    all substitutions used in every recipe on this site. -->
                </p>
            </section>
            <section>
                <h3>Made For All Home Cooks</h3>
                <p>
                    We all start somewhere. One of the reasons I made this site is to help the friends who replied to my
                    Instagram stories asking for my recipes and cooking tips. You might be one of them! Like Chef
                    Gusteau from Ratatouille, I have always believed that <b>anyone can cook</b>. Not only are all of my
                    recipes written to be as approachable and simple as possible, but there are also resources for
                    beginners right on this site. <NuxtLink to="/blog">Check out the blog</NuxtLink> for more info!
                    <!-- TODO: LINK TO SPECIFIC RESOURCES -->
                </p>
            </section>
            <section>
                <h3>No Ads, Ever</h3>
                <p>
                    Let's face it: Unless you're one of the 39% of iPhone customers that buy the Plus or Pro Max models
                    <InlineCitation
                        href="https://www.macrumors.com/2024/11/21/best-selling-iphone-model-sizes-revealed/"
                        display-text="iPhone Base Models Remain Best-Sellers Despite Pro Max Appeal"
                        :citation-list="citationList"
                        :add-to-list-callback="addToCitationList"
                        :highlight-bibliography-entry-callback="highlightBibliographyEntry" />, you don't have a lot of
                    screen space to work with. I will never sacrifice valuable screen space or your privacy in the
                    interest of a few cents of ad revenue.
                </p>
            </section>
        </section>
        <Bibliography :citation-list="citationList" />
    </main>
</template>
