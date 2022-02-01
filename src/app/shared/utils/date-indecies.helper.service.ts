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
} 