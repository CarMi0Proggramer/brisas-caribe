<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { Button } from "@/components/ui/button";
import { ref, watch } from "vue";
import { Service } from "@/lib/interfaces/service";

const props = defineProps<{ service?: Service }>();

const emit = defineEmits<{
  (event: "submit", payload: Partial<Service>): void;
}>();

const isOpen = defineModel<boolean>({ required: true, default: false });
const form = ref<Partial<Service>>({
  name: "",
  price: 0,
});
const errors = ref<Record<string, string>>({
  name: "",
  price: "",
});

watch(isOpen, (open) => {
  if (open) {
    if (props.service) {
      form.value = { ...props.service };
    } else {
      resetForm();
    }
  }
});

function resetForm() {
  form.value = {
    name: "",
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
    name: "El nombre es obligatorio",
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
          <Label for="name" class="block text-sm font-medium mb-1"
            >Nombre</Label
          >
          <Input id="name" v-model="form.name" placeholder="Ej: ABC123" />
          <p v-if="errors.name" class="text-sm text-destructive mt-1">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <NumberField
            id="price"
            v-model="form.price"
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
