import { Pipe, PipeTransform } from '@angular/core';
import { BaseType } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';

@Pipe({ name: 'baseTypePipe' })
export class BaseTypePipe implements PipeTransform {
    transform(value: BaseType | null | undefined): string {
        if (!value) {
            return "";
        }
        switch (value) {
            case BaseType.TSN:
                return "ТСН";
            case BaseType.TSN_MGE:
                return "ТСН МГЭ";
            case BaseType.TSN_MGE_13:
                return "ТСН МГЭ. Глава 13";
            case BaseType.TER:
                return "ТЕР";
            case BaseType.TER_YANAO:
                return "ТСН ЯНАО";
            case BaseType.TSNB:
                return "ТСНБ";
            case BaseType.FER:
                return "ФЕР";
        }
    }
}