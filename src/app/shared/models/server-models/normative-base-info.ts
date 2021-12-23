export interface NormativeBaseInfo {
    guid: string;
    name: string;
    additionalNumber: number;
}

export interface AvailableBaseAdditionInfo {
    /// <summary>
    /// Идентификатор
    /// </summary>
    guid: string;

    /// <summary>
    /// Является ли отмененной
    /// </summary>
    isCancelled: boolean;

    /// <summary>
    /// Флаг доступности
    /// </summary>
    isAvailable: boolean;

    /// <summary>
    /// Наименование
    /// </summary>
    name: string;

    /// <summary>
    /// Короткое наименование
    /// </summary>
    shortName: string;

    /// <summary>
    /// Номер дополнения
    /// </summary>
    additionNumber: number;

    /// <summary>
    /// Тип НБ
    /// </summary>
    type: BaseType

    /// <summary>
    /// Родительский тип НБ
    /// </summary>
    parentBaseType?: BaseType;

    /// <summary>
    /// Ключевые слова для автопривязки сметы из внешних источников к базе
    /// </summary>
    additionRegexp: string;
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