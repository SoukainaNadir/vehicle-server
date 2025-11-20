export class FakeResponse {
  gotStatus: number = 0;
  gotJson: object = {};

  json(p: object): FakeResponse {
    this.gotJson = p;
    return this;
  }

  status(s: number): FakeResponse {
    this.gotStatus = s;
    return this;
  }
}
