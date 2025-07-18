import type Event from "./EventType";

export default interface EventCardChildren {
  event: Event;
  onDelete?: (event: Event) => void;
  secondsLeft?: number;
}
