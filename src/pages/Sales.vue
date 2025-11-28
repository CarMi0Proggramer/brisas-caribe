<script setup lang="ts">
import { onMounted } from "vue";
import { useStats } from "@/lib/composables/useStats";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart } from "@/components/ui/chart-line";
import { DonutChart } from "@/components/ui/chart-donut";
import { DollarSign, Car, TrendingUp, RefreshCcw } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const {
  monthlyEarnings,
  yearlyEarnings,
  paymentStats,
  uberJobs,
  jobsByDay,
  totalJobs,
  loading,
  fetchStats,
} = useStats();

onMounted(fetchStats);

function valueFormatter(tick: number | Date) {
  return typeof tick === "number" ? `% ${tick.toFixed(2)}` : "";
}
</script>
<template>
  <section class="p-4 sm:p-6 md:p-8 space-y-8 animate-fade-in">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold">Reporte de Ventas</h1>
        <p class="text-sm text-muted-foreground">
          Resumen de desempeño de este año
        </p>
      </div>

      <Button
        variant="outline"
        @click="fetchStats"
        :disabled="loading"
        class="w-full sm:w-auto"
      >
        <RefreshCcw class="w-4 h-4 mr-2" />
        {{ loading ? "Actualizando..." : "Actualizar" }}
      </Button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle class="text-base sm:text-lg font-semibold"
            >Ganancias Anuales</CardTitle
          >
          <DollarSign class="w-5 h-5 text-green-500" />
        </CardHeader>
        <CardContent class="text-xl sm:text-2xl font-bold">
          <div
            v-if="loading"
            class="h-6 w-24 bg-neutral-900 rounded animate-pulse"
          ></div>
          <div v-else>R$ {{ yearlyEarnings }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle class="text-base sm:text-lg font-semibold"
            >Trabajos del Mes</CardTitle
          >
          <TrendingUp class="w-5 h-5 text-blue-500" />
        </CardHeader>
        <CardContent class="text-xl sm:text-2xl font-bold">
          <div
            v-if="loading"
            class="h-6 w-20 bg-neutral-900 rounded animate-pulse"
          ></div>
          <div v-else>{{ totalJobs }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle class="text-base sm:text-lg font-semibold"
            >Lavados Uber</CardTitle
          >
          <Car class="w-5 h-5 text-indigo-500" />
        </CardHeader>
        <CardContent class="text-xl sm:text-2xl font-bold">
          <div
            v-if="loading"
            class="h-6 w-20 bg-neutral-900 rounded animate-pulse"
          ></div>
          <div v-else>{{ uberJobs }}</div>
        </CardContent>
      </Card>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Ganancias Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-if="loading"
            class="h-64 sm:h-80 md:h-96 bg-neutral-900 rounded animate-pulse"
          ></div>

          <LineChart
            v-else
            :data="monthlyEarnings"
            index="month"
            :categories="['Total']"
            :colors="['oklch(0.696 0.17 162.48)']"
            class="h-64 sm:h-80 md:h-96"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Métodos de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-if="loading"
            class="h-64 sm:h-80 md:h-96 bg-neutral-900 rounded animate-pulse"
          ></div>

          <div
            v-else
            class="flex justify-center items-center h-64 sm:h-80 md:h-96"
          >
            <DonutChart
              :data="paymentStats"
              index="name"
              category="percentage"
              :colors="[
                'oklch(25.7% 0.09 281.288)',
                'oklch(20.5% 0 0)',
                'oklch(37.9% 0.146 265.522)',
                'oklch(39.6% 0.141 25.723)',
              ]"
              :value-formatter="valueFormatter"
              class="h-48 sm:h-60 md:h-72"
            />
          </div>
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle class="text-lg">Lavados por Día (Este Mes)</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          v-if="loading"
          class="h-64 sm:h-80 md:h-96 bg-neutral-900 rounded animate-pulse"
        ></div>

        <LineChart
          v-else
          :data="jobsByDay"
          index="day"
          :categories="['Total']"
          :colors="['oklch(0.696 0.17 162.48)']"
          class="h-64 sm:h-80 md:h-96"
        />
      </CardContent>
    </Card>
  </section>
</template>
