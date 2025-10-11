<script setup lang="ts">
import "./index.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar.vue";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main ref="mainEl" class="p-8 flex flex-col gap-2 w-full">
      <RouterView></RouterView>
    </main>
  </SidebarProvider>
</template>
