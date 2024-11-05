import { DefineComponent } from "vue";

export interface MenuItem {
  label: string;
  value: string;
  desc: string;
  icon: DefineComponent;
}
