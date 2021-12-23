export interface NormativeBaseInfo {
    guid: string;
    name: string;
    additionalNumber: number;
}

export interface AvailableBaseAdditionInfo {
    /// <summary>
    /// Идентификатор
    /// </summary>
    Guid: string;

    /// <summary>
    /// Является ли отмененной
    /// </summary>
    IsCancelled: boolean;

    /// <summary>
    /// Флаг доступности
    /// </summary>
    IsAvailable: boolean;

    /// <summary>
    /// Наименование
    /// </summary>
    Name: string;

    /// <summary>
    /// Короткое наименование
    /// </summary>
    ShortName: string;

    /// <summary>
    /// Номер дополнения
    /// </summary>
    AdditionNumber: number;

    /// <summary>
    /// Тип НБ
    /// </summary>
    Type: BaseType

    /// <summary>
    /// Родительский тип НБ
    /// </summary>
    ParentBaseType?: BaseType;

    /// <summary>
    /// Ключевые слова для автопривязки сметы из внешних источников к базе
    /// </summary>
    AdditionRegexp: string;
}

export enum BaseType {
    /// <summary>
    /// ТЭР
    /// </summary>
    TER = 1,
    /// <summary>
    /// ФЭР
    /// </summary>
    FER = 2,
    /// <summary>
    /// ТСН
    /// </summary>
    TSN = 3,
    /// <summary>
    /// ТЕР ЯНАО
    /// </summary>
    TER_YANAO = 4,
    /// <summary>
    /// ТСН МГЭ
    /// </summary>
    TSN_MGE = 5,
    /// <summary>
    /// ТСНБ
    /// </summary>
    TSNB = 6,
    /// <summary>
    /// ТСН МГЭ 13 глава
    /// </summary>
    TSN_MGE_13 = 7
}