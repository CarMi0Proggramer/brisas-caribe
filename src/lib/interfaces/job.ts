import { PaymentType } from "../enums/payment-type";
import { Service } from "./service";

export interface Job {
  id: number;
  service_id: number;
  plate: string;
  price: number;
  car_type: string;
  is_uber: boolean;
  payment_type: PaymentType;
  created_at: string;
  service?: Service;
}
