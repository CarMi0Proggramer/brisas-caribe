import { ref } from "vue";
import { Job } from "../interfaces/job";
import { Pagination } from "../interfaces/pagination";
import { ROWS_PER_PAGE } from "../constants";
import { getAllJobs } from "../repositories/job";
import { PaginateOptions } from "../interfaces/paginate-options";
import { sleep } from "../utils/sleep";

export function useJobs() {
  const loading = ref<boolean>(false);
  const error = ref<boolean>(false);
  const pagination = ref<Pagination>({ perPage: ROWS_PER_PAGE });
  const jobs = ref<Job[]>([]);

  const fetchJobs = async (options?: PaginateOptions) => {
    loading.value = true;
    const start = Date.now();

    try {
      const result = await getAllJobs(options);

      jobs.value = result.jobs;
      pagination.value = result.pagination;
      error.value = false;
    } catch {
      error.value = true;
    }

    if (Date.now() - start < 300) {
      await sleep(300);
    }

    loading.value = false;
  };

  return { loading, jobs, pagination, error, fetchJobs };
}
