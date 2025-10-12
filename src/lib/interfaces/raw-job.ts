import { PaymentType } from "../enums/payment-type";

export interface RawJob {
  id: number;
  service_id: number;
  plate: string;
  price: number;
  car_type: string;
  is_uber: string;
  payment_type: PaymentType;
  created_at: string;
}
