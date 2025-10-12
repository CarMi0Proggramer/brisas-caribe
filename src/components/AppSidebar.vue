<script setup lang="ts">
import { BarChart2, Home, Settings } from "lucide-vue-next";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Administración",
    url: "/",
    icon: Home,
  },
  {
    title: "Servicios",
    url: "/services",
    icon: Settings,
  },
  {
    title: "Ventas",
    url: "/sales",
    icon: BarChart2,
  },
];
</script>

<template>
  <Sidebar collapsible="none" class="fixed left-0 min-h-screen">
    <SidebarHeader class="px-4 py-6 border-b">
      <div class="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Logo Brisas Caribe"
          class="size-15 rounded-full object-cover object-center"
        />
        <div class="text-left leading-tight">
          <h1 class="text-lg font-semibold text-sidebar-accent-foreground">
            Brisas Caribe
          </h1>
          <p class="text-base text-sidebar-ring">Hola Yoiset, 👋🏻</p>
        </div>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton asChild class="px-4 py-5 text-base gap-3">
                <RouterLink :to="item.url" class="flex items-center">
                  <component :is="item.icon" />
                  <span class="tex-lg">{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
