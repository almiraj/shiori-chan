export class EditModeUtil {
  on = false;
  off = true;

  constructor(
    private onSaved: Function
  ) {}

  toggle() {
    this.on = !this.on;
    this.off = !this.off;
    if (this.off) {
      this.onSaved();
    }
  }
}
