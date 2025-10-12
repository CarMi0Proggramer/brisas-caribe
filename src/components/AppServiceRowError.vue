<script setup lang="ts">
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";
import { RotateCw } from "lucide-vue-next";

const router = useRouter();

function retry() {
  router.push("/services");
}
</script>

<template>
  <TableRow>
    <TableCell colspan="3" class="py-6">
      <div class="flex flex-col items-center gap-4">
        <div class="text-destructive font-semibold text-lg">
          Ocurrió un error al cargar los datos
        </div>
        <Button variant="destructive" @click="retry"
          ><RotateCw class="size-4" /> Reintentar
        </Button>
      </div>
    </TableCell>
  </TableRow>
</template>
