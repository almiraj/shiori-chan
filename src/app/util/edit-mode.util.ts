export class EditModeUtil {
  private _on = false;
  private _off = true;
  private _onSaved = new Function();
  private _onEdit = new Function();

  get on() {
    return this._on;
  }
  get off() {
    return this._off;
  }
  get onDisplay() {
    return this._on ? 'block' : 'none';
  }
  get offDisplay() {
    return this._off ? 'block' : 'none';
  }

  onSaved(_onSaved: Function) {
    this._onSaved = _onSaved;
  }
  onEdit(_onEdit: Function) {
    this._onEdit = _onEdit;
  }
  toggle() {
    this._on = !this._on;
    this._off = !this._off;
    if (this._on) {
      this._onEdit();
    } else {
      this._onSaved();
    }
  }
}
