import { Pipe, PipeTransform } from '@angular/core';
import { ReleasePeriodType } from 'src/app/shared/models/server-models/AvailableBaseIndexInfo';

@Pipe({ name: 'periodPipe' })
export class PeriodPipe implements PipeTransform {
    transform(value: ReleasePeriodType): string {
        switch (value) {
            case ReleasePeriodType.Month:
                return "месяц";
            case ReleasePeriodType.Quarter:
                return "квартал";
            
        }
    }
}