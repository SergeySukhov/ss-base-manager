import { AvailableBaseIndexInfo, ReleasePeriodType } from "../models/server-models/AvailableBaseIndexInfo";

export class DateIndeciesHelper {
    public static GetAllMonths(): string[] {
        const months: string[] = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(2021, i, 1);
            date.toLocaleString("ru-RU", { month: "long" })
            months.push(date.toLocaleString("ru-RU", { month: "long" }));
        }
        return months;
    }

    public static GetAllQuarters(): string[] {
        const months: string[] = DateIndeciesHelper.GetAllMonths();
        const quarters: string[] = [];
        for (let i = 0; i < 12; i += 3) {
            quarters.push("Квартал " + (i / 3 + 1) + " (" + months[i] + ", " + months[i + 1] + ", " + months[i + 2] + ")");
        }
        return quarters;
    }

    public static GetAllIndeciesYears(): string[] {
        const years: string[] = [];
        const date = new Date().getFullYear();

        for (let i = 1991; i < date + 1; i++) {
            years.push("" + i);
        }

        return years;
    }

    public static GetPeriod(index: AvailableBaseIndexInfo): string {
        if (index.releasePeriodValue >= 0) {
            if (index.releasePeriodType === ReleasePeriodType.Month && index.releasePeriodValue < 12) {
                return this.GetAllMonths()[index.releasePeriodValue];
            } else if (index.releasePeriodType === ReleasePeriodType.Quarter && index.releasePeriodValue < 4) {
                return this.GetAllQuarters()[index.releasePeriodValue];
            }
        }
        return "некорректный период выпуска индекса";
    }

    public static toPeriodFromString(value: string): { periodType: ReleasePeriodType, value: number } | null {
        const result = { periodType: ReleasePeriodType.Month, value: 0 };
        const months = DateIndeciesHelper.GetAllMonths();
        for (let i = 0; i < months.length; i++) {
            const month = months[i];
            if (month === value) {
                result.periodType = ReleasePeriodType.Month;
                result.value = i;
                return result;
            }
        }

        const quarters = DateIndeciesHelper.GetAllQuarters();
        for (let i = 0; i < quarters.length; i++) {
            const quarter = quarters[i];
            if (quarter === value) {
                result.periodType = ReleasePeriodType.Quarter;
                result.value = i;
                return result;
            }
        }
        return null;
    }
} 