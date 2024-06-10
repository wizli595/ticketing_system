import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from "@wizlitickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
