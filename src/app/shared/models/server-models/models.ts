export class BattleSession {
    Guid: string;
    Player1Guid: string;
    Player2Guid: string;
    Player1Ready: boolean;
    Player2Ready: boolean;
    Field1Guid: string;
    Field2Guid: string;
    LastMoveTime: Date;
    PlayerTurn: number;
    Mode: string;
    State: SessionState
}

export class Move {
    Guid: string;
    SessionGuid: string;
    MoveOrder: number;
    MoveType: string;
    IsEndTurn: boolean;
    MoveData: string;
}

export class User {
    Guid: string;
    Nickname: string;
    Email: string;
    LastIp: string;
    PwdHash: string;
    State: UserState;
    Status: UserStatus;
    Rank: number;
    Complaints: number;
    CurrentSession: string;
}
export class EncodedField {
    Guid: string;
    UserGuid: string;
    EncodedWalls: string;
    Heroes: ServerHero[];
    Stuffs: ServerStuff[];
}

export class ServerHero {
    Guid: string;
    FieldGuid: string;
    HeroType: string;
    StuffTypes: string;
    X: number;
    Y: number;
}

export class ServerStuff {
    Guid: string;
    FieldGuid: string;
    StuffType: string;
    X: number;
    Y: number;
}






export enum UserState {
    Online,
    InButtle,
    Offline,
    Watching,
    Searching,
    guest
}

export enum UserStatus {
    Banned,
    Guest,
    Authorized
}

export enum SessionState {
    searching,
    gaming,
    canceled,
    finished,
}
