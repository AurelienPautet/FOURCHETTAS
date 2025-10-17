export default interface Order {
  id: number;
  name: string;
  firstname: string;
  phone: string;
  event_id: number;
  items: { item_id: number; ordered_quantity: number }[];
  created_at: string;
  prepared: boolean;
  delivered: boolean;
  price?: number;
  deleted: boolean;
}
