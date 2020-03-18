import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../types/group';
import { SnapcastService } from '../services/snapcast.service';
import { Stream } from '../types/stream';
import { Server } from '../types/server';

@Component({
  selector: 'stream-selection',
  templateUrl: './stream-selection.component.html',
  styleUrls: ['./stream-selection.component.scss']
})
export class StreamSelectionComponent {
  @Input() group: Group;
  @Input() server: Server;
  constructor(private snapcast: SnapcastService) { }

  previousStream(group: Group) {
    const streamIndex = this.findIndexOfStream(group.stream_id);
    const newStream: Stream = this.server.streams[this.findPreviousIndexInArray(this.server.streams, streamIndex)];
    this.updateStream(group, newStream);
  }
  nextStream(group: Group) {
    const streamIndex = this.findIndexOfStream(group.stream_id);
    const newStream: Stream = this.server.streams[this.findNextIndexInArray(this.server.streams, streamIndex)];
    this.updateStream(group, newStream);
  }
  updateStream(group: Group, stream: Stream) {
    group.stream_id = stream.id;
    this.snapcast.setStream(group, stream);
  }
  private findIndexOfStream(streamId) {
    for (let index = 0; index < this.server.streams.length; index++) {
      const stream = this.server.streams[index];
      if (stream.id === streamId) {
        return index;
      }
    }
    return 0;
  }

  isStreamPlaying(stream: Stream): boolean {
    return stream.status === "playing";
  }

  findStreamForId(streamId: string) {
    return this.server.streams.find(stream => stream.id === streamId);
  }

  private findNextIndexInArray(array: any[], index: number): number {
    if (index >= array.length) {
      return -1;
    }
    if (index < 0) {
      return 0;
    }
    if (index + 1 === array.length) {
      return 0;
    }
    return index + 1;
  }
  private findPreviousIndexInArray(array: any[], index: number): number {
    if (index >= array.length) {
      return -1;
    }
    if (index < 0) {
      return 0;
    }
    if (index - 1 < 0) {
      return array.length - 1;
    }
    return index - 1;
  }

  isSpotifyStream(stream: Stream): boolean {
    return stream.uri.raw.startsWith('spotify') ||
      stream.id === 'spotify' ||
      stream.id === 'Spotify' ||
      stream.id === 'SPOTIFY';
  }
  isBluetoothStream(stream: Stream): boolean {
    return stream.id === 'bluetooth' ||
      stream.id === 'Bluetooth' ||
      stream.id === 'BlueTooth' ||
      stream.id === 'BLUETOOTH';
  }
}
