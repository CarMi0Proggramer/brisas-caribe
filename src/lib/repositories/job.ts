import { ROWS_PER_PAGE } from "../constants";
import { getDatabase } from "../utils/database";
import { Job } from "../interfaces/job";
import { PaginateOptions } from "../interfaces/paginate-options";
import { Service } from "../interfaces/service";
import { mapJob } from "../utils/map-job";
import { RawJob } from "../interfaces/raw-job";

export async function getAllJobs(options?: PaginateOptions) {
  const page: number = options?.page ?? 1;
  const skip = (page - 1) * ROWS_PER_PAGE;
  const sortBy = options?.sortBy ?? "created_at";
  const sortDirection = options?.sortDirection ?? "DESC";
  const searchTerm: string = options?.searchTerm ?? "";

  const db = await getDatabase();
  const services = await db.select<Service[]>("SELECT * FROM services");
  const results = await db.select<RawJob[]>(
    `
        SELECT * FROM jobs WHERE plate LIKE $1
        ORDER BY ${sortBy} ${sortDirection}
        LIMIT $2 OFFSET $3
        `,
    [`%${searchTerm}%`, ROWS_PER_PAGE, skip]
  );

  const [{ totalItems }] = await db.select<{ totalItems: number }[]>(
    "SELECT COUNT(*) as totalItems from jobs"
  );

  const pagination = {
    perPage: ROWS_PER_PAGE,
    page,
    totalItems,
    totalPages: Math.ceil(totalItems / ROWS_PER_PAGE),
  };
  const jobs = results.map((row) => mapJob(row, services));

  return { jobs, pagination };
}

export async function createOrUpdateJob(data: Partial<Job>) {
  const db = await getDatabase();

  if (data.id) {
    const result = await db.select<{ id: number }[]>(
      "SELECT id FROM jobs WHERE id = $1 LIMIT 1",
      [data.id]
    );

    if (result.length === 0) {
      console.warn("Record not found");
      return;
    }

    await db.execute(
      `UPDATE jobs SET 
        plate = $1, 
        price = $2, 
        car_type = $3,
        payment_type = $4,
        is_uber = $5,
        service_id = $6
      WHERE id = $7
      `,
      [
        data.plate,
        data.price,
        data.car_type,
        data.payment_type,
        data.is_uber,
        data.service_id,
        data.id,
      ]
    );

    return;
  }

  await db.execute(
    `INSERT INTO jobs(
      plate,price,car_type,payment_type,is_uber,service_id
    ) VALUES(?,?,?,?,?,?,?)`,
    [
      data.plate,
      data.price,
      data.car_type,
      data.payment_type,
      data.is_uber,
      data.service_id,
    ]
  );
}

export async function deleteJob(id: number) {
  const db = await getDatabase();

  const result = await db.select<{ id: number }[]>(
    "SELECT id FROM jobs WHERE id = $1 LIMIT 1",
    [id]
  );

  if (result.length === 0) {
    return false;
  }

  await db.execute("DELETE FROM jobs WHERE id = $1", [id]);

  return true;
}
