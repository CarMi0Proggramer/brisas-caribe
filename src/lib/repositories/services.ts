import { ROWS_PER_PAGE } from "../constants";
import { getDatabase } from "../utils/database";
import { PaginateOptions } from "../interfaces/paginate-options";
import { Service } from "../interfaces/service";

export async function getAllServices() {
  const db = await getDatabase();

  const results = await db.select<Service[]>(
    `
        SELECT * FROM services
        ORDER BY name ASC
        `
  );

  return results;
}

export async function getServices(options?: PaginateOptions) {
  const page: number = options?.page ?? 1;
  const skip = (page - 1) * ROWS_PER_PAGE;

  const db = await getDatabase();
  const services = await db.select<Service[]>(
    `
        SELECT * FROM services
        ORDER BY name ASC
        LIMIT $1 OFFSET $2
        `,
    [ROWS_PER_PAGE, skip]
  );

  const [{ totalItems }] = await db.select<{ totalItems: number }[]>(
    "SELECT COUNT(*) as totalItems from services"
  );

  const pagination = {
    page,
    totalItems,
    perPage: ROWS_PER_PAGE,
    totalPages: Math.ceil(totalItems / ROWS_PER_PAGE),
  };

  return { services, pagination };
}

export async function createOrUpdateService(data: Partial<Service>) {
  const db = await getDatabase();

  if (data.id) {
    const result = await db.select<{ id: number }[]>(
      "SELECT id FROM services WHERE id = $1 LIMIT 1",
      [data.id]
    );

    if (result.length === 0) {
      console.warn("Record not found");
      return;
    }

    await db.execute(
      "UPDATE services SET name = $1, price = $2 WHERE id = $3",
      [data.name, data.price, data.id]
    );

    return;
  }

  await db.execute("INSERT INTO services(name,price) VALUES(?,?)", [
    data.name,
    data.price,
  ]);
}

export async function deleteService(id: number) {
  const db = await getDatabase();

  const result = await db.select<{ id: number }[]>(
    "SELECT id FROM services WHERE id = $1 LIMIT 1",
    [id]
  );

  if (result.length === 0) {
    return false;
  }

  await db.execute("DELETE FROM jobs WHERE service_id = $1", [id]);
  await db.execute("DELETE FROM services WHERE id = $1", [id]);

  return true;
}
