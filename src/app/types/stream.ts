export class Stream {
    id: string;
    meta: {
        STREAM: string;
    };
    status: string;
    uri: {
        freagment: string;
        host: string;
        path: string;
        query: {
            bitrate: string;
            buffer_ms: string;
            codec: string;
            devicename: string;
            name: string;
            sampleformat: string;
        };
        raw: string;
        scheme: string;
    }
}