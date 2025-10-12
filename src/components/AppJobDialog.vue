<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentType } from "@/lib/enums/payment-type";
import { useAllServices } from "@/lib/composables/useAllServices";
import { ref, watch } from "vue";
import { Job } from "@/lib/interfaces/job";

const props = defineProps<{ job?: Job }>();

const emit = defineEmits<{
  (event: "submit", payload: Partial<Job>): void;
}>();

const isOpen = defineModel<boolean>({ required: true, default: false });
const form = ref<Partial<Job>>({
  plate: "",
  car_type: "",
  payment_type: PaymentType.CASH,
  is_uber: false,
  price: 0,
});
const errors = ref<Record<string, string>>({
  plate: "",
  car_type: "",
  price: "",
  service_id: "",
  payment_type: "",
});

const {
  loading: loadingServices,
  error: errorServices,
  services,
  fetchAllServices,
} = useAllServices();

watch(isOpen, (open) => {
  if (open) {
    fetchAllServices();

    if (props.job) {
      form.value = { ...props.job };
    } else {
      resetForm();
    }
  }
});

function resetForm() {
  form.value = {
    plate: "",
    car_type: "",
    payment_type: PaymentType.CASH,
    is_uber: false,
    price: 0,
  };
}

function handleSubmit() {
  if (!validateForm()) return;

  emit("submit", { ...form.value });
  resetForm();

  isOpen.value = false;
}

function validateForm() {
  errors.value = {};

  let isValid: boolean = true;
  const requiredFields: Record<string, string> = {
    plate: "La chapa es obligatoria",
    car_type: "La marca es obligatoria",
    service_id: "Debes seleccionar un servicio",
    payment_type: "Selecciona una forma de pago",
    price: "El precio es obligatorio",
  };

  Object.keys(requiredFields).forEach((key) => {
    if (!form.value[key as keyof typeof form.value]) {
      errors.value[key] = requiredFields[key];
      isValid = false;
    }
  });

  return isValid;
}

function close() {
  isOpen.value = false;
  errors.value = {};
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{
          form.id ? "Editar Registro" : "Nuevo Registro"
        }}</DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4 mt-2">
        <div>
          <Label for="plate" class="block text-sm font-medium mb-1"
            >Chapa del carro</Label
          >
          <Input id="plate" v-model="form.plate" placeholder="Ej: ABC123" />
          <p v-if="errors.plate" class="text-sm text-destructive mt-1">
            {{ errors.plate }}
          </p>
        </div>

        <div>
          <Label for="carType" class="block text-sm font-medium mb-1"
            >Marca del carro</Label
          >
          <Input
            id="carType"
            v-model="form.car_type"
            placeholder="Ej: Toyota"
          />
          <p v-if="errors.car_type" class="text-sm text-destructive mt-1">
            {{ errors.car_type }}
          </p>
        </div>

        <div>
          <NumberField
            v-model="form.price"
            id="price"
            :default-value="0"
            :min="1"
          >
            <Label for="price">Precio</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <p v-if="errors.price" class="text-sm text-destructive mt-1">
            {{ errors.price }}
          </p>
        </div>

        <div class="flex gap-6">
          <div>
            <Label for="serviceType" class="block text-sm font-medium mb-1"
              >Tipo de servicio</Label
            >
            <Select
              id="serviceType"
              v-model="form.service_id"
              :disabled="loadingServices"
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                <template v-if="errorServices">
                  <div class="p-2 text-sm text-destructive">
                    Error al cargar servicios
                  </div>
                </template>
                <template v-else>
                  <SelectItem
                    v-for="service in services"
                    :key="service.id"
                    :value="service.id"
                  >
                    {{ service.name }}
                  </SelectItem>
                </template>
              </SelectContent>
            </Select>
            <p v-if="errors.service_id" class="text-sm text-destructive mt-1">
              {{ errors.service_id }}
            </p>
          </div>
          <div>
            <Label class="block text-sm font-medium mb-1">Método de pago</Label>
            <Select v-model="form.payment_type">
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="PaymentType.CASH">Efectivo</SelectItem>
                <SelectItem :value="PaymentType.DEBIT">Débito</SelectItem>
                <SelectItem :value="PaymentType.CREDIT">Crédito</SelectItem>
                <SelectItem :value="PaymentType.PIX">PIX</SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.payment_type" class="text-sm text-destructive mt-1">
              {{ errors.payment_type }}
            </p>
          </div>
        </div>

        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox v-model="form.is_uber" />
            <span>Uber</span>
          </label>
        </div>

        <DialogFooter class="mt-6">
          <Button type="button" variant="outline" @click="close">
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
