import { ref } from "vue";
import { Job } from "../interfaces/job";
import { getDatabase } from "../database";
import { Service } from "../interfaces/service";
import { Pagination } from "../interfaces/pagination";
import { ROWS_PER_PAGE } from "../constants";

type SortBy = "plate" | "created_at" | "price";
type SortDirection = "ASC" | "DESC";

export interface UseJobsOptions {
  page?: number;
  searchTerm?: string;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
}

export function useJobs() {
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const pagination = ref<Pagination>({ perPage: ROWS_PER_PAGE });
  const jobs = ref<Job[]>([]);

  const fetchJobs = async (options?: UseJobsOptions) => {
    loading.value = true;

    const page: number = options?.page ?? 1;
    const skip = (page - 1) * ROWS_PER_PAGE;
    const sortBy: SortBy = options?.sortBy ?? "created_at";
    const sortDirection: SortDirection = options?.sortDirection ?? "DESC";
    const searchTerm: string = options?.searchTerm ?? "";

    try {
      const db = await getDatabase();
      const services = await db.select<Service[]>("SELECT * FROM services");

      const results = await db.select<Job[]>(
        `
      SELECT * FROM jobs WHERE plate LIKE ?
      ORDER BY ${sortBy} ${sortDirection}
      LIMIT ? OFFSET ?
      `,
        [`%${searchTerm}%`, ROWS_PER_PAGE, skip]
      );

      jobs.value = results.map((row) => ({
        ...row,
        service: services.find((service) => service.id === row.service_id),
      }));

      const { totalItems } = await db.select<{ totalItems: number }>(
        "SELECT COUNT(*) as totalItems from jobs"
      );

      pagination.value = {
        perPage: ROWS_PER_PAGE,
        page,
        totalItems,
        totalPages: Math.ceil(totalItems / ROWS_PER_PAGE),
      };
      error.value = false;
    } catch {
      error.value = true;
    }

    loading.value = false;
  };

  return { loading, jobs, pagination, error, fetchJobs };
}
