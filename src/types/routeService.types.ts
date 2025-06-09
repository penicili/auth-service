// Type definitions for Route Service

interface CreateRouteRequest {
    driver_id: number;
    vehicle_id: number;
    start_location: string;
    end_location: string;
    start_time: string; // ISO date-time string format
    notes?: string;
}
interface UpdateRouteStatusRequest {
    status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
}

interface RouteResponse {
    id: number;
    driver_id: number;
    driver?: {
        id: number;
        license_number: string;
        name: string;
        email: string;
        status: string;
    };
    vehicle_id: number;
    vehicle?: {
        id: number;
        type: string;
        plate_number: string;
        status: string;
    };
    start_location: string;
    end_location: string;
    status: string;
    start_time: string;
    end_time?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}
export {
    CreateRouteRequest,
    UpdateRouteStatusRequest,
    RouteResponse}