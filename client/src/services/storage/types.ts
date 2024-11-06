import { FedhaEvent } from '../../models/event.ts';

interface StateEventTarget extends EventTarget {
  addEventListener<EventNames>(
    type: EventNames,
    listener: (event: EventNames) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  dispatchEvent(event: FedhaEvent): boolean;
  removeEventListener<EventNames>(
    type: EventNames,
    listener: (event: EventNames) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
}

export const FedhaEventTarget = EventTarget as {
  new (): StateEventTarget;
  prototype: StateEventTarget;
};
