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
    <main class="ms-96 p-8 flex flex-col gap-2 w-full">
      <RouterView></RouterView>
    </main>
  </SidebarProvider>
</template>
