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
