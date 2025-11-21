import { expect, jest, test } from '@jest/globals';
import { Pool } from 'pg';
import { Request, Response } from 'express';

import { FakeResponse } from "../fake/response";
import { CreateVehicleController } from "./create";
import { Vehicle } from "../model/vehicle";
import { VehicleStore } from "../store/vehicle";
import { AppError, ErrorCode } from "../errors";

jest.mock('../store/vehicle', () => ({
    VehicleStore: jest.fn().mockImplementation(() => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createVehicle: jest.fn().mockImplementation(async (req: any): Promise<Vehicle> => {
            return new Vehicle(
                12,
                req.shortcode,
                req.battery,
                req.position
            );
        }),
    })),
}
));

describe('create vehicle controller', () => {
    let controller: CreateVehicleController;
    let store: VehicleStore;

    beforeEach(() => {
        store = new VehicleStore({} as Pool);
        controller = new CreateVehicleController(store);
    });


    test('creates a valid vehicle', async () => {
        const req = {
            body: {
                shortcode: 'abcd',
                battery: 17,
                longitude: 45,
                latitude: 45,

            },
        };

        const resp = new FakeResponse();

        await controller.handle(
            req as unknown as Request,
            resp as unknown as Response
        );

        const json = resp.gotJson as { vehicle: Vehicle };

        expect(json.vehicle.id).toBe(12);
        expect(json.vehicle.shortcode).toBe('abcd');
        expect(json.vehicle.battery).toBe(17);
        expect(json.vehicle.position.latitude).toBe(45);
        expect(json.vehicle.position.longitude).toBe(45);
    });


    test('throws AppError when shortcode is invalid', async () => {
        const req = {
            body: {
                shortcode: 'abc',
                battery: 17,
                latitude: 45,
                longitude: 45,
            },
        };

        const resp = new FakeResponse();

        try {
            await controller.handle(
                req as unknown as Request,
                resp as unknown as Response
            );

            fail("Expected an AppError but no error was thrown");

        } catch (err) {
            expect(err).toBeInstanceOf(AppError);

            const appErr = err as AppError;

            expect(appErr.code).toBe(ErrorCode.BadRequest);
            expect(appErr.message).toBe("Invalid create vehicle request");
            expect(appErr.details.violations).toContain(
                "Shortcode must be exactly 4 characters long"
            );
        }
    });
});
