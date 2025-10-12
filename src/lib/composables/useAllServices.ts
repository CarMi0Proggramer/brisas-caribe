import { ref } from "vue";
import type { Service } from "../interfaces/service";
import { getAllServices } from "../repositories/services";
import { sleep } from "../utils/sleep";

export function useAllServices() {
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const services = ref<Service[]>([]);

  const fetchAllServices = async () => {
    loading.value = true;
    error.value = false;

    const start = Date.now();

    try {
      services.value = await getAllServices();
    } catch {
      error.value = true;
    }

    if (Date.now() - start < 300) {
      await sleep(300);
    }

    loading.value = false;
  };

  return { loading, error, services, fetchAllServices };
}
