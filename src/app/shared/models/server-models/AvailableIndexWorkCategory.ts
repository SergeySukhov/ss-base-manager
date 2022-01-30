import { BaseType } from "./AvailableNormativeBaseType";


export interface AvailableIndexWorkCategory {
    /// <summary>
    /// Идентификатор
    /// </summary>
    guid: string;
    /// <summary>
    /// Идентификатор к корневому узлу НБ
    /// </summary>
    availableNormativeBaseTypeGuid: string;
    /// <summary>
    /// Имя корневого узел
    /// </summary>
    parentIndexName: string;
    /// <summary>
    /// Тип индекса
    /// </summary>
    workCategory: WorkCategory;

}

/// <summary>
/// Категория работ
/// </summary>
export enum WorkCategory {
    /// <summary>
    /// Строительство
    /// </summary>
    Build,
    /// <summary>
    /// Ремонт
    /// </summary>
    Renovation,
    /// <summary>
    /// Реставрация
    /// </summary>
    Restoration,
}