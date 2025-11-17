export type DayjsInput = string | number | Date | Dayjs | undefined;

type Unit = "millisecond" | "second" | "minute" | "hour" | "day" | "month" | "year";

type DayjsPlugin = (
  options: any,
  DayjsClass: typeof SimpleDayjs,
  factory: DayjsFactory
) => void;

const PERSIAN_CALENDAR_LOCALE = "fa-IR-u-ca-persian";
const PERSIAN_NUMBER_LOCALE = "fa-IR";

function normalizeDate(input?: DayjsInput): Date {
  if (!input) {
    return new Date();
  }

  if (input instanceof SimpleDayjs) {
    return new Date(input.valueOf());
  }

  if (input instanceof Date) {
    return new Date(input.getTime());
  }

  return new Date(input);
}

function formatNumber(value: number, minimumIntegerDigits = 2) {
  return new Intl.NumberFormat(PERSIAN_NUMBER_LOCALE, {
    minimumIntegerDigits,
    useGrouping: false,
  }).format(value);
}

function formatWithIntl(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(PERSIAN_CALENDAR_LOCALE, {
    ...options,
  }).format(date);
}

export class SimpleDayjs {
  private readonly date: Date;

  constructor(input?: DayjsInput) {
    this.date = normalizeDate(input);
  }

  private create(date: Date) {
    return new SimpleDayjs(date);
  }

  valueOf() {
    return this.date.getTime();
  }

  calendar(_calendar?: string) {
    return this.create(new Date(this.date.getTime()));
  }

  hour(value?: number) {
    if (typeof value === "number") {
      const d = new Date(this.date.getTime());
      d.setHours(value);
      return this.create(d);
    }
    return this.date.getHours();
  }

  minute(value?: number) {
    if (typeof value === "number") {
      const d = new Date(this.date.getTime());
      d.setMinutes(value);
      return this.create(d);
    }
    return this.date.getMinutes();
  }

  add(amount: number, unit: Unit = "millisecond") {
    const d = new Date(this.date.getTime());
    switch (unit) {
      case "year":
        d.setFullYear(d.getFullYear() + amount);
        break;
      case "month":
        d.setMonth(d.getMonth() + amount);
        break;
      case "day":
        d.setDate(d.getDate() + amount);
        break;
      case "hour":
        d.setHours(d.getHours() + amount);
        break;
      case "minute":
        d.setMinutes(d.getMinutes() + amount);
        break;
      case "second":
        d.setSeconds(d.getSeconds() + amount);
        break;
      default:
        d.setMilliseconds(d.getMilliseconds() + amount);
    }
    return this.create(d);
  }

  subtract(amount: number, unit: Unit = "millisecond") {
    return this.add(-amount, unit);
  }

  startOf(unit: Unit) {
    const d = new Date(this.date.getTime());
    if (unit === "day") {
      d.setHours(0, 0, 0, 0);
    } else if (unit === "month") {
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
    } else if (unit === "year") {
      d.setMonth(0, 1);
      d.setHours(0, 0, 0, 0);
    }
    return this.create(d);
  }

  endOf(unit: Unit) {
    const d = new Date(this.date.getTime());
    if (unit === "day") {
      d.setHours(23, 59, 59, 999);
    } else if (unit === "month") {
      d.setMonth(d.getMonth() + 1, 0);
      d.setHours(23, 59, 59, 999);
    } else if (unit === "year") {
      d.setMonth(11, 31);
      d.setHours(23, 59, 59, 999);
    }
    return this.create(d);
  }

  isSame(input: DayjsInput, unit?: Unit) {
    const other = new SimpleDayjs(input);
    if (unit === "day") {
      return this.startOf("day").valueOf() === other.startOf("day").valueOf();
    }
    if (unit === "month") {
      return (
        this.startOf("month").valueOf() === other.startOf("month").valueOf()
      );
    }
    if (unit === "year") {
      return this.startOf("year").valueOf() === other.startOf("year").valueOf();
    }
    return this.valueOf() === other.valueOf();
  }

  isBetween(
    startInput: DayjsInput,
    endInput: DayjsInput,
    unit: Unit = "millisecond",
    inclusivity = "()"
  ) {
    const start = new SimpleDayjs(startInput);
    const end = new SimpleDayjs(endInput);
    const target = unit === "day" ? this.startOf("day") : this;
    const startValue =
      unit === "day" ? start.startOf("day").valueOf() : start.valueOf();
    const endValue = unit === "day" ? end.endOf("day").valueOf() : end.valueOf();
    const value = target.valueOf();
    const leftInclusive = inclusivity.charAt(0) === "[";
    const rightInclusive = inclusivity.charAt(1) === "]";
    const leftCheck = leftInclusive ? value >= startValue : value > startValue;
    const rightCheck = rightInclusive ? value <= endValue : value < endValue;
    return leftCheck && rightCheck;
  }

  toDate() {
    return new Date(this.date.getTime());
  }

  toISOString() {
    return this.date.toISOString();
  }

  format(pattern: string) {
    const date = this.date;
    const tokens: Record<string, string> = {
      YYYY: formatWithIntl(date, { year: "numeric" }),
      MMMM: formatWithIntl(date, { month: "long" }),
      MM: formatWithIntl(date, { month: "2-digit" }),
      DD: formatWithIntl(date, { day: "2-digit" }),
      D: formatWithIntl(date, { day: "numeric" }),
      dddd: formatWithIntl(date, { weekday: "long" }),
      HH: formatNumber(date.getHours()),
      mm: formatNumber(date.getMinutes()),
    };

    return pattern.replace(
      /YYYY|MMMM|dddd|MM|DD|D|HH|mm/g,
      (token) => tokens[token] ?? token
    );
  }
}

export type Dayjs = SimpleDayjs;

export interface DayjsFactory {
  (input?: DayjsInput): Dayjs;
  extend: (plugin: DayjsPlugin, options?: any) => void;
  locale: (_locale?: string) => void;
}

const dayjs = ((input?: DayjsInput) => new SimpleDayjs(input)) as DayjsFactory;

dayjs.extend = (plugin: DayjsPlugin, options?: any) => {
  plugin?.(options, SimpleDayjs, dayjs);
};

dayjs.locale = () => {
  /* Persian locale is baked into formatting helpers. */
};

export default dayjs;
