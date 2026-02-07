export default interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  form_closing_date: string;
  form_closing_time: string;
  img_url: string;
  deleting?: boolean;
  deliveries_enabled: boolean;
  deliveries_price: number;
  deliveries_start_time?: string | null;
  deliveries_end_time?: string | null;
  deliveries_info?: string | null;
}
