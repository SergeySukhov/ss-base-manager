import { Pipe, PipeTransform } from '@angular/core';
import { ReleasePeriodType } from 'src/app/shared/models/server-models/AvailableBaseIndexInfo';
import { WorkCategory } from 'src/app/shared/models/server-models/AvailableIndexWorkCategory';

@Pipe({ name: 'periodPipe' })
export class WorkCategoryPipe implements PipeTransform {
    transform(value: WorkCategory): string {
        switch (value) {
            case WorkCategory.Build:
                return "строительство";
            case WorkCategory.Renovation:
                return "ремонт";
            case WorkCategory.Restoration:
                return "восстановление";
            default:
                return "неизвестный";
        }
    }

    backTransform(value: string): WorkCategory | null {
        switch (value.trim().toLocaleLowerCase()) {
            case "строительство":
                return WorkCategory.Build;
            case "ремонт":
                return  WorkCategory.Renovation;
            case "восстановление":
                return WorkCategory.Restoration;
            default:
                return null;
        }
    }
}