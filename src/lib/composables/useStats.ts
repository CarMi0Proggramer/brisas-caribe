import { ref } from "vue";
import {
  getMonthlyEarnings,
  getYearlyEarnings,
  getPaymentTypesStats,
  getUberJobsThisMonth,
  getJobsByDayThisMonth,
  getTotalJobsThisMonth,
} from "@/lib/repositories/sales";
import type { Earning } from "@/lib/interfaces/earning";
import type { PaymentTypeStat } from "@/lib/interfaces/payment-type-stat";
import type { JobDayStat } from "@/lib/interfaces/jobs-day-stat";

export function useStats() {
  const monthlyEarnings = ref<Earning[]>([]);
  const yearlyEarnings = ref<number>(0);
  const paymentStats = ref<PaymentTypeStat[]>([]);
  const uberJobs = ref<number>(0);
  const jobsByDay = ref<JobDayStat[]>([]);
  const totalJobs = ref<number>(0);

  const loading = ref<boolean>(true);
  const error = ref<boolean>(false);

  async function fetchStats() {
    try {
      loading.value = true;
      error.value = false;

      monthlyEarnings.value = await getMonthlyEarnings();
      yearlyEarnings.value = await getYearlyEarnings();
      paymentStats.value = await getPaymentTypesStats();
      uberJobs.value = await getUberJobsThisMonth();
      jobsByDay.value = await getJobsByDayThisMonth();
      totalJobs.value = await getTotalJobsThisMonth();
    } catch (err) {
      console.log(err);

      error.value = true;
    }

    loading.value = false;
  }

  return {
    monthlyEarnings,
    yearlyEarnings,
    paymentStats,
    uberJobs,
    jobsByDay,
    totalJobs,
    loading,
    error,
    fetchStats,
  };
}
