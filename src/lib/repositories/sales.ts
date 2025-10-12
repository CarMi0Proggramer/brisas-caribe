import { Earning } from "../interfaces/earning";
import { JobDayStat } from "../interfaces/jobs-day-stat";
import { PaymentTypeStat } from "../interfaces/payment-type-stat";
import { getDatabase } from "../utils/database";
import { formatDate } from "../utils/format-date";

export async function getMonthlyEarnings() {
  const db = await getDatabase();
  const earnings = await db.select<Earning[]>(
    `
    SELECT 
      created_at AS month,
      SUM(price) AS Total
    FROM jobs
    WHERE strftime('%Y', created_at) = strftime('%Y', 'now')
    GROUP BY month
    ORDER BY month;
  `
  );

  return earnings.map((earning) => ({
    ...earning,
    month: formatDate(earning.month),
  }));
}

export async function getYearlyEarnings() {
  const db = await getDatabase();
  const [result] = await db.select<{ earnings: number | null }[]>(
    `
    SELECT SUM(price) AS earnings
    FROM jobs
    WHERE strftime('%Y', created_at) = strftime('%Y', 'now');
  `
  );

  return result.earnings ?? 0;
}

export async function getPaymentTypesStats() {
  const db = await getDatabase();
  const rows = await db.select<PaymentTypeStat[]>(`
    SELECT 
      payment_type as name,
      ROUND(COUNT(*) * 100.0 / (
        SELECT COUNT(*) FROM jobs 
        WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
      ), 1) AS percentage
    FROM jobs
    WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    GROUP BY name;
  `);

  return rows;
}

export async function getUberJobsThisMonth() {
  const db = await getDatabase();
  const [result] = await db.select<{ total: number }[]>(`
    SELECT COUNT(*) AS total
    FROM jobs
    WHERE is_uber = "true"
      AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now');
  `);

  return result.total;
}

export async function getJobsByDayThisMonth() {
  const db = await getDatabase();
  const rows = await db.select<JobDayStat[]>(`
    SELECT 
      created_at AS day,
      COUNT(*) AS Total
    FROM jobs
    WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    GROUP BY day
    ORDER BY day;
  `);

  return rows.map((row) => ({
    ...row,
    day: formatDate(row.day),
  }));
}

export async function getTotalJobsThisMonth() {
  const db = await getDatabase();
  const [result] = await db.select<{ total: number }[]>(`
    SELECT COUNT(*) AS total
    FROM jobs
    WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now');
  `);

  return result.total;
}
