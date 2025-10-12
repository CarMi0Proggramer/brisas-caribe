<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import AppServicesTable from "@/components/AppServicesTable.vue";
import AppServiceDialog from "@/components/AppServiceDialog.vue";
import { useServices } from "@/lib/composables/useServices";
import { debounce } from "@/lib/utils/debounce";
import { Plus } from "lucide-vue-next";
import { ref, watch } from "vue";
import { Service } from "@/lib/interfaces/service";
import {
  createOrUpdateService,
  deleteService,
} from "@/lib/repositories/services";
import { showMessage } from "@/lib/utils/show-message";

const { loading, error, services, fetchServices, pagination } = useServices();
const isServiceDialogOpen = ref<boolean>(false);
const selectedService = ref<Service | null>(null);
const currentPage = ref<number>(1);

fetchServices({ page: currentPage.value });

watch(
  currentPage,
  debounce(() => fetchServices({ page: currentPage.value }), 500)
);

async function onSubmit(service: Partial<Service>) {
  await createOrUpdateService(service);
  fetchServices({ page: currentPage.value });

  showMessage(service.id ? "Servicio actualizado" : "Servicio creado");
}

async function handleDelete(service: Service) {
  await deleteService(service.id);

  if (services.value.length === 1) {
    currentPage.value = Math.max(1, currentPage.value - 1);

    if (currentPage.value !== 1) {
      return;
    }
  }

  fetchServices({ page: currentPage.value });
  showMessage("Servicio eliminado");
}
</script>

<template>
  <section class="p-8 space-y-8 animate-fade-in">
    <div class="flex w-full gap-6 mb-6">
      <div class="flex justify-end flex-1">
        <Button
          @click="
            isServiceDialogOpen = true;
            selectedService = null;
          "
          class="flex items-center gap-2 px-4 py-2 text-base font-medium transition-all duration-200 hover:scale-105"
        >
          <Plus class="size-4" />
          Nuevo Registro
        </Button>
      </div>
    </div>
    <AppServicesTable
      :loading="loading"
      :services="services"
      :error="error"
      @delete="handleDelete"
      @edit="
        isServiceDialogOpen = true;
        selectedService = $event;
      "
    />
    <Pagination
      class="justify-start my-8"
      v-slot="{ page }"
      :page="pagination.page"
      :items-per-page="pagination.perPage"
      :total="pagination.totalItems"
      :default-page="1"
      @update:page="currentPage = $event"
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
  <AppServiceDialog
    v-model="isServiceDialogOpen"
    :service="selectedService"
    @submit="onSubmit"
  />
</template>
