import { VehicleStore } from '../store/vehicle';
import { Request, Response } from 'express';

interface QueryParams {
  limit: string
  longitude: string
  latitude: string
}

export class FindVehiclesController {
  constructor(private readonly vehicleStore: VehicleStore) {}

  public async handle(req: Request<object, object, object, QueryParams>, res: Response): Promise<void> {
    const vehicles = await this.vehicleStore.findVehicles({
      limit: parseInt(req.query.limit) || 10,
      location: {
        longitude: parseInt(req.query.longitude) || 0.0,
        latitude: parseInt(req.query.latitude) || 0.0
      },
    });

   res.status(200).json({ vehicles: vehicles });
  }
}
