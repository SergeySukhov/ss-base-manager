export interface NormativeBaseInfo {
    guid: string;
    name: string;
    additionalNumber: number;
}

export interface AvailableNormativeBaseType {
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
    /// Тип НБ
    /// </summary>
    type: BaseType

    /// <summary>
    /// Короткое наименование
    /// </summary>
    typeName: string;

    /// <summary>
    /// Список доступных узлов
    /// </summary>
    availabilityNodes: AvailabilityNodes[],
}

/// <summary>
/// Доступные узлы
/// </summary>
export enum AvailabilityNodes {
    /// <summary>
    /// Нормативы
    /// </summary>
    Normatives,

    /// <summary>
    /// Индексы
    /// </summary>
    Indexes,

    /// <summary>
    /// Поправки
    /// </summary>
    Corrections
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