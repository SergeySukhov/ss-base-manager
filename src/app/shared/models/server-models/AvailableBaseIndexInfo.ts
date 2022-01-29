import { AvailableIndexWorkCategory } from "./AvailableIndexWorkCategory";
import { BaseType } from "./AvailableNormativeBaseType";

/// <summary>
/// Информация об одном сборнике индексов
/// </summary>
export interface AvailableBaseIndexInfo {
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
    /// Номер дополнения
    /// </summary>
    additionNumber: number;
    /// <summary>
    /// Тип НБ
    /// </summary>
    type: BaseType
    /// <summary>
    /// Месяц/квартал индекса
    /// </summary>
    releasePeriodValue: number;
    /// <summary>
    /// Тип периода выпуска
    /// </summary>
    releasePeriodType: ReleasePeriodType;
    /// <summary>
    /// Год индекса
    /// </summary>
    year: number;
    /// <summary>
    /// Путь к тех части
    /// </summary>
    techDocPath: string;
    /// <summary>
    /// Идентификатор к корневому узлу сборника индексов
    /// </summary>
    availableIndexWorkCategoryGuid: string;
    /// <summary>
    /// Корневой узел сборника индексов
    /// </summary>
    parentIndex: AvailableIndexWorkCategory
}

export enum ReleasePeriodType {
    /// <summary>
    /// Месяц
    /// </summary>
    Month,

    /// <summary>
    /// Квартал
    /// </summary>
    Quarter
}