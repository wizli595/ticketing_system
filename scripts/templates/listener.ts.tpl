import { Listener, {{eventName}}, Subjects } from "@wizlitickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class {{className}} extends Listener<{{eventName}}> {
    readonly subject = Subjects.{{subject}};
    queueGroupName = queueGroupName;

    async onMessage(data: {{eventName}}["data"], msg: Message) {
        try {
            // TODO: implement handler logic

            msg.ack();
        } catch (err) {
            console.error("Error processing {{eventName}}:", err);
            msg.ack();
        }
    }
}
