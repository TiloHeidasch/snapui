import { Host } from './host';

export class Client {
    config: {
        instance: number;
        latency: number;
        name;
        volume: {
            muted: boolean;
            percent: number;
        }
    };
    connected: boolean;
    host: Host;
    id: string;
    lastSeen: {
        sec: number;
        usec: number;
    };
    snapclient: {
        name: string;
        protocolVersion: number;
        version: string;
    }
}