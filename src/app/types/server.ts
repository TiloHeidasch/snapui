import { Group } from './group';
import { Host } from './host';
import { Stream } from './stream';

export class Server {
    groups: Group[];
    server: {
        host: Host;
        snapserver: {
            controlProtocolVersion: number;
            name: string;
            protocolVersion: number;
            version: string;
        }
    };
    streams: Stream[];
}