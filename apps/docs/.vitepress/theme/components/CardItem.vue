<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps<{
  title: string
  tag: string
  summary: string
  link: string
}>()

const isExternal = computed(() => props.link.startsWith('http'))
const href = computed(() =>
  isExternal.value ? props.link : withBase(props.link)
)
</script>

<template>
  <a
    :href="href"
    class="card-item"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <span class="card-tag">{{ tag }}</span>
    <div class="card-title">{{ title }}</div>
    <div class="card-summary">{{ summary }}</div>
  </a>
</template>
