import { ref } from "vue";
import { getDatabase } from "../database";
import { Service } from "../interfaces/service";
import { Pagination } from "../interfaces/pagination";
import { ROWS_PER_PAGE } from "../constants";

interface UseServicesOptions {
  page?: number;
}

export function useServices() {
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const pagination = ref<Pagination>({ perPage: ROWS_PER_PAGE });
  const services = ref<Service[]>([]);

  const fetchServices = async (options?: UseServicesOptions) => {
    loading.value = true;

    const page: number = options?.page ?? 1;
    const skip = (page - 1) * ROWS_PER_PAGE;

    try {
      const db = await getDatabase();
      const results = await db.select<Service[]>(
        `
      SELECT * FROM services
      LIMIT ? OFFSET ?
      ORDER BY name ASC
      `,
        [ROWS_PER_PAGE, skip]
      );

      services.value = results;

      const { totalItems } = await db.select<{ totalItems: number }>(
        "SELECT COUNT(*) as totalItems from services"
      );

      pagination.value = {
        page,
        totalItems,
        perPage: ROWS_PER_PAGE,
        totalPages: Math.ceil(totalItems / ROWS_PER_PAGE),
      };

      error.value = false;
    } catch {
      error.value = true;
    }

    loading.value = false;
  };

  return { loading, services, pagination, error, fetchServices };
}
