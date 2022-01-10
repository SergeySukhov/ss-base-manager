import * as signalR from "@microsoft/signalr";
import { ImoprtanceLevel, NotificationType } from "src/app/core/common/models/notification.models";
import { NetWorkerRequestSub, NetWorkerSub } from "src/app/shared/models/net-messages/net-worker-messages";
import { environment } from "src/environments/environment";
import { v4 } from "uuid";
import { MessageHandler } from "../message-services/message-handler.service";

export class HubConnectionService {
    constructor(private messageHandler: MessageHandler) {

    }

    createSub(initSubRequest: NetWorkerRequestSub, url?: string,) {
        const netSubMessage: NetWorkerSub = {
            guid: initSubRequest.guid,
            messageType: initSubRequest.messageType,
            needSub: true,
            data: {
                guid: v4(),
                fromService: "Воркер клиента",
                imoprtance: ImoprtanceLevel.high,
                type: NotificationType.error,
                message: "Не удалось установить подключение к серверу",
                timeStamp: "0.00"
            },
        }

        try {
            let connection = new signalR.HubConnectionBuilder()
                .withUrl(url ?? environment.logger)
                .build();

            connection.on("send", data => {
                console.log(data);
                netSubMessage.data = JSON.parse(data);
                this.messageHandler.toClient(netSubMessage);
            });

            connection.start()
                .then(() => connection.invoke("send", "Hello"));
        } catch (ex) {
            this.messageHandler.toClient(netSubMessage);
        }

        // setInterval(() => {
        //     this.messageHandler.toClient(netSubMessage);
        // }, 2000)
    }
}