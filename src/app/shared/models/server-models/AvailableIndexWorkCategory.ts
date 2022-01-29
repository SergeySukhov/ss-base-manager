import { BaseType } from "./AvailableNormativeBaseType";


export interface AvailableIndexWorkCategory {
    /// <summary>
    /// Идентификатор
    /// </summary>
    guid: string;
    /// <summary>
    /// Идентификатор к корневому узлу НБ
    /// </summary>
    AvailableNormativeBaseTypeGuid: string;
    /// <summary>
    /// Имя корневого узел
    /// </summary>
    ParentIndexName: string;
    /// <summary>
    /// Тип индекса
    /// </summary>
    WorkCategory: WorkCategory;

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