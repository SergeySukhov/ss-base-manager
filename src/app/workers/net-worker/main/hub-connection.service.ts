import * as signalR from "@microsoft/signalr";
import { ImoprtanceLevel, NotificationType } from "src/app/core/common/models/notification.models";
import { NetWorkerRequestSub, NetWorkerSub } from "src/app/shared/models/net-messages/net-worker-messages";
import { environment } from "src/environments/environment";
import { v4 } from "uuid";
import { MessageHandler } from "../message-services/message-handler.service";

export class HubConnectionService {

    public get connectionId(): string | null {
        return this.pConnectionId;
    }

    private pConnectionId = "";
    private hub: signalR.HubConnection | null = null;
    constructor(private messageHandler: MessageHandler) {

    }

    async initHub(url?: string) {
        const connectionOptions: signalR.IHttpConnectionOptions = {
            transport: signalR.HttpTransportType.WebSockets,
            skipNegotiation: true
        };

        this.hub = new signalR.HubConnectionBuilder()
            .withUrl(url ?? environment.logger, connectionOptions)
            .withAutomaticReconnect()
            .build();

        await this.hub.start();
        const id = await this.hub.invoke("GetConnectionId");
        console.log("!! | initHub | id", id)
        this.pConnectionId = id;
    }

    createSub(initSubRequest: NetWorkerRequestSub, url?: string) {
        if (!this.hub) {
            return;
        }
        const netSubMessage: NetWorkerSub = {
            guid: initSubRequest.guid,
            messageType: initSubRequest.messageType,
            isSub: true,
            data: {
                message: {
                    guid: v4(),
                    fromService: "Воркер клиента",
                    imoprtance: ImoprtanceLevel.high,
                    type: NotificationType.error,
                    message: "Не удалось установить подключение к серверу",
                    timeStamp: Date.now().toLocaleString()
                }
            },
        }

        try {
            this.hub.on("Notification", data => {
                console.log(data);
                netSubMessage.data = JSON.parse(data);
                this.messageHandler.toClient(netSubMessage);
            });
        } catch (ex) {
            this.messageHandler.toClient(netSubMessage);
        }

        // setInterval(() => {
        //     this.messageHandler.toClient(netSubMessage);
        // }, 2000)
    }
}