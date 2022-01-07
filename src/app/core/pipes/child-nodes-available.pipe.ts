import { Pipe, PipeTransform } from '@angular/core';
import { AvailabilityNodes } from 'src/app/shared/models/server-models/AvailableNormativeBaseType';

@Pipe({ name: 'childNodesAvailablePipe' })
export class ChildNodesAvailablePipe implements PipeTransform {
    transform(value: AvailabilityNodes): string {
        switch (value) {
            case AvailabilityNodes.Normatives:
                return "Нормативы";
            case AvailabilityNodes.Corrections:
                return "Поправки";
            case AvailabilityNodes.Indexes:
                return "Индексы";

        }
    }
}