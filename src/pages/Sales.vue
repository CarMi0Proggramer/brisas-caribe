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
  <section class="p-8 space-y-8 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Reporte de Ventas</h1>
        <p class="text-sm text-muted-foreground">
          Resumen de desempeño de este año
        </p>
      </div>

      <Button variant="outline" @click="fetchStats" :disabled="loading">
        <RefreshCcw class="w-4 h-4 mr-2" />
        {{ loading ? "Actualizando..." : "Actualizar" }}
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle class="text-lg font-semibold">Ganancias Anuales</CardTitle>
          <DollarSign class="w-5 h-5 text-green-500" />
        </CardHeader>
        <CardContent class="text-2xl font-bold">
          <div
            v-if="loading"
            class="h-8 w-24 bg-neutral-900 rounded animate-pulse"
          ></div>
          <div v-else>R$ {{ yearlyEarnings }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle class="text-lg font-semibold">Trabajos del Mes</CardTitle>
          <TrendingUp class="w-5 h-5 text-blue-500" />
        </CardHeader>
        <CardContent class="text-2xl font-bold">
          <div
            v-if="loading"
            class="h-8 w-16 bg-neutral-900 rounded animate-pulse"
          ></div>
          <div v-else>{{ totalJobs }}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex items-center justify-between">
          <CardTitle class="text-lg font-semibold">Lavados Uber</CardTitle>
          <Car class="w-5 h-5 text-indigo-500" />
        </CardHeader>
        <CardContent class="text-2xl font-bold">
          <div
            v-if="loading"
            class="h-8 w-16 bg-neutral-900 rounded animate-pulse"
          ></div>
          <div v-else>{{ uberJobs }}</div>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ganancias Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-if="loading"
            class="h-96 bg-neutral-900 rounded animate-pulse"
          ></div>
          <LineChart
            v-else
            :data="monthlyEarnings"
            index="month"
            :categories="['Total']"
            :colors="['oklch(0.696 0.17 162.48)']"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            v-if="loading"
            class="h-96 bg-neutral-900 rounded animate-pulse"
          ></div>
          <div v-else class="flex justify-center items-center h-96">
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
              class="h-72"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Lavados por Día (Este Mes)</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          v-if="loading"
          class="h-96 bg-neutral-900 rounded animate-pulse"
        ></div>
        <LineChart
          v-else
          :data="jobsByDay"
          index="day"
          :categories="['Total']"
          :colors="['oklch(0.696 0.17 162.48)']"
        />
      </CardContent>
    </Card>
  </section>
</template>
