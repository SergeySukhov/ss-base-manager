import { BaseType } from "./AvailableNormativeBaseType";


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
