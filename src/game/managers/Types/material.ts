export class Material {
  private id: number;
  private stacklimit: number;

  constructor(id: number, limit: number) {
    this.stacklimit = limit;
    this.id = id;
  }

  getItemId() {
    return this.id;
  }

  getStackLimit() {
    return this.stacklimit;
  }
}
