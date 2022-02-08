import * as signalR from "@microsoft/signalr";
import { Subject } from "rxjs";
import { ImoprtanceLevel, NotificationMessage, NotificationType } from "src/app/core/common/models/notification.models";
import { NWRequestNotificationSub, NWRequestSub, NWSubMessage } from "src/app/shared/models/net-messages/net-worker-messages";
import { environment } from "src/environments/environment";
import { v4 } from "uuid";
import { MessageHandler } from "../message-services/message-handler.service";

export class HubConnectionService {

    public get connectionId(): string | null {
        return this.pConnectionId;
    }

    private pConnectionId = "";
    private hub: signalR.HubConnection | null = null;
    constructor(private messageHandler: MessageHandler,
        private events: Subject<{ message: string, type: NotificationType, importance: ImoprtanceLevel }>) {
    }

    async initHub(url?: string) {
        const connectionOptions: signalR.IHttpConnectionOptions = {
            transport: signalR.HttpTransportType.WebSockets,
            skipNegotiation: true
        };
        try {
            this.hub = new signalR.HubConnectionBuilder()
                .withUrl(url ?? environment.logger, connectionOptions)
                .withAutomaticReconnect()
                .build();

            await this.hub.start();
            const id = await this.hub.invoke("GetConnectionId");
            this.pConnectionId = id;
        } catch (ex) {

        }

        if (!!this.pConnectionId) {
            this.events.next({ message: "Соединение установлено", type: NotificationType.info, importance: ImoprtanceLevel.high });
        } else {
            this.events.next({ message: "Соединение с сервером не установлено", type: NotificationType.warn, importance: ImoprtanceLevel.high });
        }
    }

    createNotificationSub(initSubRequest: NWRequestNotificationSub, url?: string) {
        if (!this.hub) {
            return;
        }
        const netSubMessage: NWSubMessage = {
            guid: initSubRequest.guid,
            messageType: initSubRequest.messageType,
            isSub: true,
            data: {
                message: {
                    guid: v4(),
                    fromService: "Воркер клиента",
                    imoprtance: ImoprtanceLevel.high,
                    type: NotificationType.info,
                    message: "Не удалось установить подключение к серверу",
                }
            },
        }
        this.hub.on("Notification", (data: NotificationMessage) => {
            netSubMessage.data.message = data;
            this.messageHandler.toClient(netSubMessage);
        });

        // setInterval(() => {
        //     netSubMessage.data.message.imoprtance = 1;
        //     this.messageHandler.toClient(netSubMessage);
        // }, 1000)
    }
}