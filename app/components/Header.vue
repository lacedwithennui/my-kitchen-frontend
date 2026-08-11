<script setup lang="ts">
import { MenuIcon, XIcon } from "@lucide/vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
    <header class="header">
        <div class="header-content content-width minimum-margin">
            <div class="header-left">
                <NuxtLink class="header-link" to="/"><h3>Hazel's Kitchen</h3></NuxtLink>
            </div>
            <button class="menu-button" @click="toggleMobileMenu">
                <MenuIcon v-if="!isMobileMenuOpen" class="menu-icon" />
                <XIcon v-if="isMobileMenuOpen" class="menu-icon" />
            </button>
            <nav class="header-right" :class="{'mobile-menu-open': isMobileMenuOpen}">
                <NuxtLink class="header-link" to="/"><h3>Home</h3></NuxtLink>
                <NuxtLink class="header-link" to="/about"><h3>About</h3></NuxtLink>
                <NuxtLink class="header-link" to="/substitutions"><h3>Substitution Guide</h3></NuxtLink>
                <NuxtLink class="header-link" to="/blog"><h3>Blog</h3></NuxtLink>
                <!-- <NuxtLink class="header-link" to="/login"><h3>Log In</h3></NuxtLink> -->
            </nav>
        </div>
    </header>
</template>

<style scoped>
header {
    --link-padding-block: 1rem;
    --link-padding-inline: 1.5rem;
    --header-height: calc(var(--h3-font-size) * var(--line-height) + 2 * var(--link-padding-block));

    --hover-background-color: var(--dust-gray);
    --active-background-color: var(--soft-periwinkle);
    --active-text-color: var(--light);
    --active-hover-background-color: color-mix(in srgb, var(--soft-periwinkle) 70%, var(--dust-gray) 30%);
    --active-active-background-color: var(--soft-periwinkle);
}

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 5px 5px var(--box-shadow-color);
    background-color: var(--background-color);
}

.header-content {
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-left,
.header-right {
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-right, .menu-button {
    margin-right: calc(-1 * var(--minimum-margin))
}

.header-link {
    text-decoration: none;
    color: var(--text-color);
    font-size: 1.25rem;
    font-weight: 700;
    padding: var(--link-padding-block) var(--link-padding-inline);
}

.header-right .header-link:hover {
    background-color: var(--hover-background-color);
}

.header-left .header-link {
    padding-inline: 0px;
}

.header-right .router-link-active {
    position: relative;
    background-color: var(--active-background-color);
    color: var(--active-text-color);
}

.header-link.router-link-active:hover {
    background-color: var(--active-hover-background-color);
}

.header-link.router-link-active:active {
    background-color: var(--active-active-background-color);
}

.router-link-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 10px;
    background-color: var(--background-color);
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.menu-button {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 1rem;
}

.menu-icon {
    height: var(--h3-font-size);
    width: auto;
}

@media screen and (--tablet-breakpoint) {
    .header-right {
        display: none;
        position: absolute;
        top: var(--header-height);
        right: 0;
        flex-direction: column;
        background-color: var(--background-color);
        /* border: 1px solid var(--border-color); */
        box-shadow: 5px 5px 5px var(--box-shadow-color);
        border-top: none;
    }

    .header-right.mobile-menu-open {
        display: flex;
    }

    .header-right .header-link {
        /* display: block; */
        width: 100%;
        text-align: center;
    }

    .menu-button {
        display: block;
    }
}
</style>
