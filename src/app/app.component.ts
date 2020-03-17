import { Component } from '@angular/core';
import { MessageService } from './services/message.service';
import { SnapcastService } from './services/snapcast.service';
import { Server } from './types/server';
import { Group } from './types/group';
import { Stream } from './types/stream';
import { Client } from './types/client';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ClientInfoDialogComponent } from './client-info-dialog/client-info-dialog.component';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component';
import { GroupInfoDialogComponent } from './group-info-dialog/group-info-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'snapui';
  server: Server;
  volumeStep: number = 5;
  constructor(private messageService: MessageService, private snapcast: SnapcastService, private dialog: MatDialog) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.messageService.on<string>('SnapcastServer').subscribe(server => {
      console.log(server);
      this.server = server;
    })
  }

  muteGroup(group: Group) {
    group.muted = !group.muted;
    this.snapcast.updateGroupMute(group);
  }
  reduceClientVolume(client: Client) {
    client.config.volume.percent -= this.volumeStep;
    this.snapcast.updateClientVolume(client);
  }
  increaseClientVolume(client: Client) {
    client.config.volume.percent += this.volumeStep;
    this.snapcast.updateClientVolume(client);
  }
  setClientVolume(client: Client, percent: number) {
    client.config.volume.percent = percent;
    this.snapcast.updateClientVolume(client);
  }
  muteClient(client: Client) {
    client.config.volume.muted = !client.config.volume.muted;
    this.snapcast.updateClientVolume(client);
  }
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
  infoClient(client: Client) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = client;
    this.dialog.open(ClientInfoDialogComponent, dialogConfig);
  }
  infoGroup(group: Group) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = group;
    this.dialog.open(GroupInfoDialogComponent, dialogConfig);
  }
  editClient(client: Client, currentGroup: Group) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = client;
    this.dialog.open(EditClientDialogComponent, dialogConfig);
  }
  editGroup(group: Group) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = group;
    this.dialog.open(EditGroupDialogComponent, dialogConfig);
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
