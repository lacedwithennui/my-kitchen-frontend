<script setup lang="ts">
const error = useError();
const errorMessage = computed(() => {
    switch (error.value?.status) {
        case 404:
            return "That page couldn't be found. Try somewhere else!";
        case 500:
        case 502:
        case 503:
            return "A server error occurred. Check again soon!";
        case 401:
            return "You need to log in to see that page.";
        case 403:
            return "Your account doesn't have access to that page.";
        case 429:
            return "You're being rate limited. Stop attempting to access this page.";
    }
    return "An error occurred. Check again soon!";
});
</script>

<template>
    <NuxtLayout>
        <main class="content content-width">
            <h1>Error {{ error?.status }}</h1>
            <p>{{ errorMessage }}</p>
        </main>
    </NuxtLayout>
</template>
