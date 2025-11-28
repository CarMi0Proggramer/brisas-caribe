<script setup lang="ts">
import "./index.css";
import "vue-sonner/style.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

import AppSidebar from "@/components/AppSidebar.vue";
</script>

<template>
  <Toaster />
  <SidebarProvider>
    <AppSidebar />
    <main
      class="p-6 w-full transition-all duration-300 data-[state=open]:md:ms-[260px] data-[state=closed]:md:ms-0"
      data-sidebar-main
    >
      <RouterView />
    </main>
  </SidebarProvider>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
</style>
