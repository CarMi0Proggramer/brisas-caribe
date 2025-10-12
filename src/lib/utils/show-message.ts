import { CheckCircle2Icon } from "lucide-vue-next";
import { toast } from "vue-sonner";

export function showMessage(message: string) {
  toast(message, {
    position: "top-center",
    icon: CheckCircle2Icon,
    action: {
      label: "Cerrar",
    },
  });
}
