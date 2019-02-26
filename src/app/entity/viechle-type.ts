export enum ViechleType {
  WALK = 'WALK',
  BICYCLE = 'BICYCLE',
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
  TAXI = 'TAXI',
  BUS = 'BUS',
  TRAIN = 'TRAIN',
  AIRPLAIN = 'AIRPLAIN',
  SWIMMER = 'SWIMMER',
  SHIP = 'SHIP',
  TRAM = 'TRAM',
  HELICOPTER = 'HELICOPTER',
}

export class ViechleTypeUtil {
  public static values() {
    const arr = [];
    for (const k of Object.keys(ViechleType)) {
      arr.push(ViechleType[k]);
    }
    return arr;
  }
}

