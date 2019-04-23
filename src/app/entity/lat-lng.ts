export class LatLng {
  constructor(
    public lat: number,
    public lng: number,
  ) {}

  static parse(raw: any) {
    if (!raw) {
      return raw;
    }
    return new LatLng(Number(raw.lat), Number(raw.lng));
  }

  toLocation() {
    return this.lat + ', ' + this.lng;
  }
}
