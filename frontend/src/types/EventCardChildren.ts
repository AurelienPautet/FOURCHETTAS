import type Event from "./EventType";

export default interface EventCardChildren {
  event: Event;
  onDelete?: (event: Event) => void;
  onCopy?: (event: Event) => void;
  secondsLeft?: number;
}
