import { Job } from "../interfaces/job";
import { RawJob } from "../interfaces/raw-job";
import { Service } from "../interfaces/service";

export function mapJob(job: RawJob, services: Service[]): Job {
  return {
    ...job,
    is_uber: job.is_uber === "true",
    service: services.find((service) => service.id === job.service_id),
  };
}
