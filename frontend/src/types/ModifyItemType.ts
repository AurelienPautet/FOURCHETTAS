import type CreateItem from "./CreateItemType";

export default interface ModifyItem extends CreateItem {
  id?: number;
  new?: boolean;
  modified?: boolean;
  toDelete?: boolean;
}
