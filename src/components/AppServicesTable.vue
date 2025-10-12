<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AppServiceRowLoading from "./AppServiceRowLoading.vue";
import AppServiceRowError from "./AppServiceRowError.vue";
import { Service } from "@/lib/interfaces/service";
import { ROWS_PER_PAGE } from "@/lib/constants";
import { Trash, Pencil } from "lucide-vue-next";

defineProps<{ loading: boolean; services: Service[]; error: boolean }>();
defineEmits<{
  (event: "edit", service: Service): void;
  (event: "delete", service: Service): void;
}>();
</script>

<template>
  <Table class="w-full">
    <TableHeader>
      <TableRow>
        <TableHead class="font-semibold text-base">Nombre </TableHead>
        <TableHead class="font-semibold text-base">Precio</TableHead>
        <TableHead class="font-semibold text-base">Acciones</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <AppServiceRowLoading
        v-if="loading"
        v-for="row in ROWS_PER_PAGE"
        :key="row"
      />
      <AppServiceRowError v-else-if="error" />
      <TableRow v-else v-for="service in services" :key="service.id">
        <TableCell class="font-medium">{{ service.name }}</TableCell>
        <TableCell>R${{ service.price }}</TableCell>
        <TableCell>
          <Button
            @click="$emit('edit', service)"
            variant="outline"
            size="icon"
            title="Editar"
          >
            <Pencil class="size-4" />
          </Button>
          <Button
            class="ms-2"
            @click="$emit('delete', service)"
            variant="destructive"
            size="icon"
            title="Eliminar"
          >
            <Trash class="size-4" />
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
