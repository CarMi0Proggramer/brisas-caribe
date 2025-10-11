<script setup lang="ts">
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AppJobsTable from "@/components/AppJobsTable.vue";
import { ref, watch } from "vue";
import { useJobs, UseJobsOptions } from "@/lib/composables/useJobs";
import { Search } from "lucide-vue-next";
import { debounce } from "@/lib/debounce";
import { Button } from "@/components/ui/button";

const { loading, error, jobs, fetchJobs, pagination } = useJobs();

const filters = ref<UseJobsOptions>({
  searchTerm: "",
  sortBy: "created_at",
  sortDirection: "DESC",
  page: 1,
});

fetchJobs(filters.value);

watch(
  filters,
  debounce(() => fetchJobs(filters.value), 500),
  { deep: true }
);
</script>

<template>
  <section class="animate-fade-in">
    <div class="flex w-full gap-6 mb-6">
      <InputGroup class="max-w-sm">
        <InputGroupInput
          v-model="filters.searchTerm"
          placeholder="Buscar chapa..."
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <Select v-model="filters.sortBy">
        <SelectTrigger class="w-60">
          <SelectValue placeholder="Ordenar..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ordenar</SelectLabel>
            <SelectItem value="plate"> Chapa </SelectItem>
            <SelectItem value="created_at"> Fecha </SelectItem>
            <SelectItem value="price"> Precio </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select v-model="filters.sortDirection">
        <SelectTrigger class="w-60">
          <SelectValue placeholder="Dirección..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Dirección</SelectLabel>
            <SelectItem value="ASC"> Ascendente </SelectItem>
            <SelectItem value="DESC"> Descendente </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div class="flex justify-end flex-1">
        <Button>Nuevo Registro</Button>
      </div>
    </div>
    <AppJobsTable :loading="loading" :jobs="jobs" :error="error" />
    <Pagination
      class="justify-start my-8"
      v-slot="{ page }"
      :page="pagination.page"
      :items-per-page="pagination.perPage"
      :total="pagination.totalItems"
      :default-page="1"
      @update:page="filters.page = $event"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious />

        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
          >
            {{ item.value }}
          </PaginationItem>
        </template>
        <PaginationEllipsis :index="4" />
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  </section>
</template>
