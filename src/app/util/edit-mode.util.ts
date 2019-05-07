export class EditModeUtil {
  on = false;
  off = true;

  constructor(
    private onSaved?: Function,
    private onEdit?: Function
  ) {}

  get onDisplay() {
    return this.on ? 'block' : 'none';
  }
  get offDisplay() {
    return this.off ? 'block' : 'none';
  }

  toggle() {
    this.on = !this.on;
    this.off = !this.off;
    if (this.off) {
      this.onSaved();
    } else {
      this.onEdit();
    }
  }
}
