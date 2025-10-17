export default interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  type: string;
  quantity: number;
  ordered_quantity?: number;
  img_url: string;
}
