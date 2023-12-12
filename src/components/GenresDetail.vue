<template>
    <div class="w-50%">
        <h2>{{ genre }}</h2>
        <span>{{ bpmRange }}</span>
        <p>{{ description }}</p>
    </div>
</template>

<script lang="ts">

export default {
    name: 'GenresDetail',
    props: ['genre', 'bpmRange', 'description']
}

</script>

<style>

</style>