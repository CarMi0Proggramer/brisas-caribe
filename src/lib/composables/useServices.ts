import { ref } from "vue";
import { Service } from "../interfaces/service";
import { Pagination } from "../interfaces/pagination";
import { ROWS_PER_PAGE } from "../constants";
import { getServices } from "../repositories/services";
import { PaginateOptions } from "../interfaces/paginate-options";
import { sleep } from "../utils/sleep";

export function useServices() {
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const pagination = ref<Pagination>({ perPage: ROWS_PER_PAGE });
  const services = ref<Service[]>([]);

  const fetchServices = async (options?: PaginateOptions) => {
    const start = Date.now();
    loading.value = true;

    try {
      const result = await getServices(options);

      pagination.value = result.pagination;
      services.value = result.services;
      error.value = false;
    } catch (err) {
      error.value = true;
    }

    if (Date.now() - start < 300) {
      await sleep(300);
    }

    loading.value = false;
  };

  return { loading, services, pagination, error, fetchServices };
}
