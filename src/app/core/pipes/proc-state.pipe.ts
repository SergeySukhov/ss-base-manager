import { Pipe, PipeTransform } from '@angular/core';
import { UploadProcessState } from "../common/models/notification.models";

@Pipe({ name: 'procStatePipe' })
export class ProcStatePipe implements PipeTransform {
    transform(value: UploadProcessState | null | undefined): string {
        if (value !== 0 && !value) {
            return "";
        }

        switch (value) {
            case UploadProcessState.deploying:
                return "Развертывание";
            case UploadProcessState.processing:
                return "Обработка";
            case UploadProcessState.error:
                return "Ошибка";
            case UploadProcessState.success:
                return "Завершен";
            case UploadProcessState.inited:
                return "Инициирован";
        }
    }
}