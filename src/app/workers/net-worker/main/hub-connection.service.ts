import * as signalR from "@microsoft/signalr";
import { HubConnection, IRetryPolicy } from "@microsoft/signalr";
import { Subject } from "rxjs";
import { ImoprtanceLevel, NotificationMessage, NotificationType, NotificationUploadProcessInfo } from "src/app/core/common/models/notification.models";
import { NWRequest, NWRequestNotificationSub, NWRequestSub, NWRequestUploadInfoSub, NWRequestUploadProcess, NWResponseCommon, NWResponseUploadProcess, NWSetUser, NWSubMessage } from "src/app/shared/models/net-messages/net-worker-messages";
import { environment } from "src/environments/environment";
import { v4 } from "uuid";
import { MessageHandler } from "../message-services/message-handler.service";

enum ConnectionStatus {
    /** Отсоединен */
    Disconnected = -1,
    /** Присоединен */
    Connected = 0,
    /** В процессе подключения к серверу */
    Connecting = 1,
}

interface RequestMethodPair {
    request: NWRequest | NWRequestSub;
    method: (request: any) => Promise<void> | void;
}

export class HubConnectionService {
    private pConnectionStatus: ConnectionStatus = ConnectionStatus.Disconnected;

    private pUserId = "";
    private pUserName = "";

    private hub: HubConnection | null = null;
    private hubQueue: RequestMethodPair[] = [];

    public get userId(): string | null {
        return this.pUserId;
    }

    public get connectionStatus(): ConnectionStatus {
        return this.pConnectionStatus;
    }

    constructor(private messageHandler: MessageHandler,
        private events: Subject<{ message: string, type: NotificationType, importance: ImoprtanceLevel }>) {
    }

    async initHub(url?: string) {
        const connectionOptions: signalR.IHttpConnectionOptions = {
            transport: signalR.HttpTransportType.WebSockets,
            skipNegotiation: true
        };
        const reconnectPolicy: IRetryPolicy = {
            nextRetryDelayInMilliseconds: () => {
                return 3000;
            },
        };

        try {
            this.hub = new signalR.HubConnectionBuilder()
                .withUrl(url ?? environment.logger, connectionOptions)
                .withAutomaticReconnect(reconnectPolicy)
                .build();
            this.hub.onreconnected(this.onReconnected.bind(this));
            this.hub.onreconnecting(this.onReconnecting.bind(this));
            this.hub.onclose(this.onClose.bind(this));

            await this.hub.start();
            this.pConnectionStatus = ConnectionStatus.Connected;

            setInterval(async () => {
                
                if (this.hub
                    && this.connectionStatus === ConnectionStatus.Connected
                    && this.hubQueue.length) {
                    const req = this.hubQueue.shift();
                    if (req) {
                        await req.method(req.request);
                    }
                }
            }, 1000);
        } catch (ex) {
            setTimeout(() => {
                this.initHub();
            }, 3000);
        }

        if (this.pConnectionStatus === ConnectionStatus.Connected) {
            this.events.next({ message: "Соединение установлено", type: NotificationType.info, importance: ImoprtanceLevel.low });
        } else {
            this.events.next({ message: "Соединение с сервером не установлено", type: NotificationType.warn, importance: ImoprtanceLevel.low });
        }
    }

    async getUploadProcesses(request: NWRequestUploadProcess) {
        if (!this.hub || this.connectionStatus !== ConnectionStatus.Connected) {
            this.hubQueue.push({ request, method: this.getUploadProcesses.bind(this) });
            return;
        }

        const response: NWResponseUploadProcess = {
            guid: request.guid,
            messageType: request.messageType,
            isSub: false,
            data: { message: [] }
        }

        const processes = await this.hub.invoke("getUploadProcesses");
        response.data.message = processes ?? [];
        this.messageHandler.toClient(response);
        this.pConnectionStatus = ConnectionStatus.Connected;
    }

    async setUser(request: NWSetUser) {
        this.pUserId = request.data.userId;
        this.pUserName = request.data.userName;

        if (!this.hub || this.connectionStatus !== ConnectionStatus.Connected) {
            this.hubQueue.push({ request, method: this.setUser.bind(this) });
            return;
        }
        const response: NWResponseCommon = {
            guid: request.guid,
            messageType: request.messageType,
            isSub: false,
        }
        this.messageHandler.toClient(response);
        await this.hub.invoke("setUser", { Id: request.data.userId, Name: request.data.userName });
        this.pConnectionStatus = ConnectionStatus.Connected;
    }

    createNotificationSub(initSubRequest: NWRequestNotificationSub, url?: string) {
        if (!this.hub || this.connectionStatus !== ConnectionStatus.Connected) {
            this.hubQueue.push({ request: initSubRequest, method: this.createNotificationSub.bind(this) });
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
                    imoprtance: ImoprtanceLevel.low,
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
        //     netSubMessage.data.message.guid = v4();
        //     netSubMessage.data.message.imoprtance = 1;
        //     netSubMessage.data.message.type = NotificationType.warn;

        //     netSubMessage.data.message.extraMessage = "тест ыфЫСЖфыс ЫСыфсС смывмывм ывм ы вм ывм ывм ы вм ыв мы вм ым ыв м ывмылвмтылвмтфдлвмм ф вмфвмщл фмщлф вмыщлвм щылвм щлы вмылвм ыщвлм ыщлвм ыщлм ыщлвм лщы вмышвмл ыщлм в ывмывмымвщыщмлтвымтылвтлыщщм  ымд ымл ывщлм"

        //     this.messageHandler.toClient(netSubMessage);
        // }, 5000)
    }

    createUploadInfoSub(initSubRequest: NWRequestUploadInfoSub, url?: string) {
        if (!this.hub || this.connectionStatus !== ConnectionStatus.Connected) {
            this.hubQueue.push({ request: initSubRequest, method: this.createNotificationSub.bind(this) });
            return;
        }

        const netSubUploadInfo: NWSubMessage = {
            guid: initSubRequest.guid,
            messageType: initSubRequest.messageType,
            isSub: true,
            data: {
                message: null
            },
        }

        this.hub.on("updateProcessInfo", (data: NotificationUploadProcessInfo) => {
            netSubUploadInfo.data.message = data;
            this.messageHandler.toClient(netSubUploadInfo);
        });
    }

    private onReconnected(connectionId?: string) {
        console.info("!! | onReconnected | this.pUserId", this.pUserId)
        if (!this.pUserId) {
            return;
        }
        this.hub?.invoke("setUser", { Id: this.pUserId, Name: this.pUserName }).then((result) => {
            this.pConnectionStatus = ConnectionStatus.Connected;
        });
    }

    private onReconnecting(error?: Error) {
        this.pConnectionStatus = ConnectionStatus.Connecting;
    }

    private onClose(error?: Error) {
        // this.pUserId = "";
        // this.pUserName = "";
        this.pConnectionStatus = ConnectionStatus.Disconnected;
    }
}