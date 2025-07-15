export default interface Order {
  id: number;
  name: string;
  firstname: string;
  phone: string;
  event_id: number;
  dish_id: number;
  side_id: number;
  drink_id: number;
  created_at: string;
  prepared: boolean;
  delivered: boolean;
  price?: number;
}
