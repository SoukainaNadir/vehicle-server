export interface Position {
  latitude: number
  longitude: number
};

export class Vehicle {
  constructor(
    public id: number,
    public shortcode: string,
    public battery: number,
    public position: Position,
  ) {}
}
