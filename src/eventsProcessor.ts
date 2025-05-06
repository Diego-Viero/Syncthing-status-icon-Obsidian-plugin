import { SyncthingMonitor } from "./checkStatus";
import { EventType } from "./eventType";

interface SyncthingEvent {
    id: number,
    globalID: number,
    type: EventType,
    time: string,
    data: {
      addr: string,
      id: string
    }
}

export const eventProcessor = (events: SyncthingEvent) => {


}