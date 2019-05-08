class PlanTheme {
  static CAFE = new PlanTheme('CAFE');
  static LAWN = new PlanTheme('LAWN');
  static STUDY = new PlanTheme('STUDY');
  static ROAD = new PlanTheme('ROAD');
  static GOLF = new PlanTheme('GOLF');
  static SEA = new PlanTheme('SEA');
  static MOUNTAIN = new PlanTheme('MOUNTAIN');
  static KYOTO = new PlanTheme('KYOTO');
  static OSAKA = new PlanTheme('OSAKA');
  static EUROPE = new PlanTheme('EUROPE');
  static VALUES: Array<PlanTheme>;

  private static NAMES: Array<string>;

  private constructor(
    public name: string
  ) {}

  get idx(): number {
    return PlanTheme.NAMES.indexOf(this.name);
  }

  static initilaze() {
    this.VALUES = [];
    for (const k in PlanTheme) {
      if (PlanTheme[k] instanceof PlanTheme) {
        this.VALUES.push(PlanTheme[k]);
      }
    }
    this.NAMES = this.VALUES.map(theme => theme.name);
  }
  static parse(raw: any) {
    return new PlanTheme(raw.name);
  }
  static valueOf(idx: number): PlanTheme {
    for (const planTheme of this.VALUES) {
      if (planTheme.idx === idx) {
        return planTheme;
      }
    }
    throw new Error('Not found value of ' + idx);
  }
}
PlanTheme.initilaze();
export { PlanTheme };
