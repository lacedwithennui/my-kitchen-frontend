<script setup lang="ts">
import { MenuIcon, XIcon } from "@lucide/vue";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
    <header class="header">
        <div class="header-content">
            <div class="header-left">
                <RouterLink class="header-link" to="/"><h2>Hazel's Kitchen</h2></RouterLink>
            </div>
            <button class="menu-button" @click="toggleMobileMenu">
                <MenuIcon v-if="!isMobileMenuOpen" class="menu-icon" />
                <XIcon v-if="isMobileMenuOpen" class="menu-icon" />
            </button>
            <nav class="header-right" :class="{'mobile-menu-open': isMobileMenuOpen}">
                <RouterLink class="header-link" to="/about"><h2>About</h2></RouterLink>
                <RouterLink class="header-link" to="/substitutions"><h2>Substitution Guide</h2></RouterLink>
                <RouterLink class="header-link" to="/blog"><h2>Blog</h2></RouterLink>
                <RouterLink class="header-link" to="/login"><h2>Log In</h2></RouterLink>
            </nav>
        </div>
    </header>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--header-height);
    box-shadow: 0px 5px 5px var(--box-shadow-color);
    background-color: var(--background-color);
}

.header-content {
    max-width: var(--content-width);
    flex: 1 1 auto;
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

.header-link {
    text-decoration: none;
    color: var(--text-color);
    font-size: 1.25rem;
    font-weight: 700;
    padding: 1rem 1.5rem;
}

.header-right .header-link:hover {
    background-color: var(--hover-background-color);
}

.router-link-active {
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
    height: var(--h2-font-size);
    width: auto;
}

@media screen and (max-width: 800px) {
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
