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
import { Button } from "@/components/ui/button";
import AppJobsTable from "@/components/AppJobsTable.vue";
import AppJobDialog from "@/components/AppJobDialog.vue";
import { useJobs } from "@/lib/composables/useJobs";
import { debounce } from "@/lib/utils/debounce";
import { createOrUpdateJob, deleteJob } from "@/lib/repositories/job";
import { Plus, Search } from "lucide-vue-next";
import { ref, watch } from "vue";
import { Job } from "@/lib/interfaces/job";
import { PaginateOptions } from "@/lib/interfaces/paginate-options";
import { showMessage } from "@/lib/utils/show-message";

const { loading, error, jobs, fetchJobs, pagination } = useJobs();
const isJobDialogOpen = ref<boolean>(false);
const selectedJob = ref<Job>();

const filters = ref<PaginateOptions>({
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

async function onSubmit(job: Partial<Job>) {
  await createOrUpdateJob(job);
  fetchJobs(filters.value);

  showMessage(job.id ? "Registro actualizado" : "Registro creado");
}

async function handleDelete(job: Job) {
  await deleteJob(job.id);

  if (jobs.value.length === 1) {
    filters.value.page = Math.max(1, filters.value.page! - 1);

    if (filters.value.page !== 1) {
      return;
    }
  }

  fetchJobs(filters.value);
  showMessage("Registro eliminado");
}
</script>
<template>
  <section class="p-6 md:p-8 space-y-8 animate-fade-in">
    <div class="w-full flex flex-wrap gap-4 md:gap-6 mb-6 items-center">
      <InputGroup class="w-full sm:w-72 md:max-w-sm">
        <InputGroupInput
          v-model="filters.searchTerm"
          placeholder="Buscar chapa..."
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <Select v-model="filters.sortBy">
        <SelectTrigger class="w-full sm:w-60">
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
        <SelectTrigger class="w-full sm:w-60">
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
      <div class="flex justify-end w-full md:flex-1 md:justify-end">
        <Button
          @click="
            isJobDialogOpen = true;
            selectedJob = undefined;
          "
          class="flex items-center gap-2 px-4 py-2 text-base font-medium transition-all duration-200 hover:scale-105 w-full sm:w-auto"
        >
          <Plus class="size-4" />
          Nuevo Registro
        </Button>
      </div>
    </div>
    <AppJobsTable
      :loading="loading"
      :jobs="jobs"
      :error="error"
      @delete="handleDelete"
      @edit="
        isJobDialogOpen = true;
        selectedJob = $event;
      "
    />
    <Pagination
      class="justify-center md:justify-start my-8"
      v-slot="{ page }"
      :page="pagination.page"
      :items-per-page="pagination.perPage"
      :total="pagination.totalItems"
      :default-page="1"
      @update:page="filters.page = $event"
    >
      <PaginationContent v-slot="{ items }" class="flex flex-wrap gap-2">
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
  <AppJobDialog
    v-model="isJobDialogOpen"
    :job="selectedJob"
    @submit="onSubmit"
  />
</template>
