export class PlanTheme {
  private static valuesCache: Array<PlanTheme>;

  static CAFE = new PlanTheme('CAFE', 0);
  static SEA = new PlanTheme('SEA', 1);
  static ROAD = new PlanTheme('ROAD', 2);
  static KYOTO = new PlanTheme('KYOTO', 3);
  static OSAKA = new PlanTheme('OSAKA', 4);
  static EUROPE = new PlanTheme('EUROPE', 5);
  static GOLF = new PlanTheme('GOLF', 6);
  static MOUNTAIN = new PlanTheme('MOUNTAIN', 7);
  static RUNNING = new PlanTheme('RUNNING', 8);

  private constructor(
    public name: string,
    public idx: number
  ) {}

  static parse(raw: any) {
    return new PlanTheme(raw.name, raw.idx);
  }
  static values(): Array<PlanTheme> {
    if (PlanTheme.valuesCache) {
      return PlanTheme.valuesCache;
    }
    const values = [];
    for (const k in PlanTheme) {
      if (PlanTheme[k] instanceof PlanTheme) {
        values.push(PlanTheme[k]);
      }
    }
    return PlanTheme.valuesCache = values;
  }
  static valueOf(idx: number): PlanTheme {
    for (const planTheme of PlanTheme.values()) {
      if (planTheme.idx === idx) {
        return planTheme;
      }
    }
    throw new Error('Not found value of ' + idx);
  }
}
