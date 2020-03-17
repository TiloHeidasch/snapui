import { Client } from './client';

export class Group {
    clients: Client[];
    id: string;
    muted: boolean;
    name: string;
    stream_id: string;
}