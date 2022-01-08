import * as signalR from "@microsoft/signalr";
import { NetWorkerRequestSub, NetWorkerSub } from "src/app/shared/models/net-messages/net-worker-messages";
import { environment } from "src/environments/environment";
import { MessageHandler } from "../message-services/message-handler.service";

export class HubConnectionService {
    constructor(private messageHandler: MessageHandler) {

    }

    createSub(initSubRequest: NetWorkerRequestSub, url?: string,) {
        // let connection = new signalR.HubConnectionBuilder()
        //     .withUrl(url ?? environment.logger)
        //     .build();

        // connection.on("send", data => {
        //     console.log(data);
        //     const netSubMessage: NetWorkerSub = {
        //         guid: initSubRequest.guid,
        //         messageType: initSubRequest.messageType,
        //         needSub: true,
        //         data: JSON.parse(data)
        //     }
        //     this.messageHandler.toClient(netSubMessage);
        // });

        // connection.start()
        // .then(() => connection.invoke("send", "Hello"));

        const netSubMessage: NetWorkerSub = {
            guid: initSubRequest.guid,
            messageType: initSubRequest.messageType,
            needSub: true,
            data: "!!",
        }
        setInterval(() => {
            this.messageHandler.toClient(netSubMessage);
        }, 2000)



    }
}