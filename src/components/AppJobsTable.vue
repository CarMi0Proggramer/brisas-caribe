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
import AppJobRowLoading from "./AppJobRowLoading.vue";
import AppJobRowError from "./AppJobRowError.vue";
import { PaymentType } from "@/lib/enums/payment-type";
import { Job } from "@/lib/interfaces/job";
import { ROWS_PER_PAGE } from "@/lib/constants";
import { Trash, Pencil } from "lucide-vue-next";
import { formatDate } from "@/lib/utils/format-date";

defineProps<{ loading: boolean; jobs: Job[]; error: boolean }>();
defineEmits<{
  (event: "edit", job: Job): void;
  (event: "delete", job: Job): void;
}>();

function getPaymentTypeText(paymentType: PaymentType): string {
  switch (paymentType) {
    case PaymentType.CASH:
      return "Efectivo";
    case PaymentType.DEBIT:
      return "Débito";
    case PaymentType.CREDIT:
      return "Crédito";
    case PaymentType.PIX:
      return "PIX";
  }
}
</script>

<template>
  <Table class="w-full">
    <TableHeader>
      <TableRow>
        <TableHead class="font-semibold text-base"> Chapa del Carro </TableHead>
        <TableHead class="font-semibold text-base">Marca del Carro</TableHead>
        <TableHead class="font-semibold text-base">Tipo de Servicio</TableHead>
        <TableHead class="font-semibold text-base">Uber</TableHead>
        <TableHead class="font-semibold text-base">Método de Pago</TableHead>
        <TableHead class="font-semibold text-base">Fecha</TableHead>
        <TableHead class="font-semibold text-base">Precio</TableHead>
        <TableHead class="font-semibold text-base">Acciones</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <AppJobRowLoading
        v-if="loading"
        v-for="row in ROWS_PER_PAGE"
        :key="row"
      />
      <AppJobRowError v-else-if="error" />
      <TableRow v-else v-for="job in jobs" :key="job.id">
        <TableCell class="font-medium">{{ job.plate }}</TableCell>
        <TableCell>{{ job.car_type }}</TableCell>
        <TableCell>{{ job.service!.name }}</TableCell>
        <TableCell>{{ job.is_uber ? "Sí ✅" : "No ❌" }}</TableCell>
        <TableCell>{{ getPaymentTypeText(job.payment_type) }}</TableCell>
        <TableCell>{{ formatDate(job.created_at) }}</TableCell>
        <TableCell>R$ {{ job.price }}</TableCell>
        <TableCell>
          <Button
            @click="$emit('edit', job)"
            variant="outline"
            size="icon"
            title="Editar"
          >
            <Pencil class="size-4" />
          </Button>
          <Button
            class="ms-2"
            @click="$emit('delete', job)"
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
