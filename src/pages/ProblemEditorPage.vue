<template>
  <AppShell
    :eyebrow="mode === 'edit' ? 'Edit Problem' : 'Write Note'"
    :title="mode === 'edit' ? 'Update your algorithm note' : 'Capture a fresh solution record'"
    description="Form interactions and validation will be added in the dedicated create/edit issue branch."
  >
    <section class="placeholder-card">
      <span>Mode</span>
      <strong>{{ mode }}</strong>
    </section>
  </AppShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppShell from '../layouts/AppShell.vue'

const route = useRoute()
const mode = computed(() => (route.meta.mode === 'edit' ? 'edit' : 'create'))
</script>
