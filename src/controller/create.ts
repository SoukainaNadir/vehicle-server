import { VehicleStore } from '../store/vehicle';
import { AppError, ErrorCode } from '../errors';
import { Request, Response } from 'express';

interface CreateVehiclePayload {
  shortcode: string;
  battery: number;
  latitude: number;
  longitude: number;
}

export class CreateVehicleController {
  constructor(private readonly vehicleStore: VehicleStore) {}

  public async handle(req: Request<object, object, CreateVehiclePayload>, res: Response): Promise<void> {
    const violations = validateRequestPayload(req.body);
    if (violations.length > 0) {
      throw new AppError(
        ErrorCode.BadRequest,
        "Invalid create vehicle request",
        { violations: violations },
      )
    }

    const vehicle = await this.vehicleStore.createVehicle({
      shortcode: req.body.shortcode,
      battery: req.body.battery,
      position: {
        latitude: req.body.longitude,
        longitude: req.body.latitude,
      },
    });

    res.status(200).json({ vehicle: vehicle });
  }
}

function validateRequestPayload(req: CreateVehiclePayload): string[] {
  const violations :string[] = []

  if (req.shortcode.length != 6) {
    violations.push("Shortcode must be only 4 characters long");
  }

  if (req.battery < 0 || req.battery > 100) {
    violations.push("Battery level must be between 0 and 100");
  }

  if (req.longitude < -90 || req.longitude > 90) {
    violations.push("Longitude must be between -90 and 90");
  }

  if (req.latitude < -90 || req.latitude > 90) {
    violations.push("Latitude must be between -90 and 90");
  }

  return violations;
}

