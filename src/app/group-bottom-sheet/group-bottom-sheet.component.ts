import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Group } from '../types/group';
import { Client } from '../types/client';
import { Server } from '../types/server';
import { Stream } from '../types/stream';
import { MessageService } from '../services/message.service';
import { ClientFunctionsService } from '../services/client-functions.service';
import { SnapcastService } from '../services/snapcast.service';
import { GroupFunctionsService } from '../services/group-functions.service';

@Component({
  selector: 'app-group-bottom-sheet',
  templateUrl: './group-bottom-sheet.component.html',
  styleUrls: ['./group-bottom-sheet.component.scss']
})
export class GroupBottomSheetComponent implements OnInit {
  group: Group;
  server: Server;
  isExpanded: boolean = false;
  clientFunctions: ClientFunctionsService;
  groupFunctions: GroupFunctionsService;
  constructor(private snapcast: SnapcastService, private clientFunctionsService: ClientFunctionsService, private groupFunctionsService: GroupFunctionsService, private messageService: MessageService, private _bottomSheetRef: MatBottomSheetRef<GroupBottomSheetComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) data) {
    this.group = data.group;
    this.server = data.server;
    this.clientFunctions = clientFunctionsService;
    this.groupFunctions = groupFunctionsService;
  }
  ngOnInit(): void {

  }
  getGroupName(): string {
    let isFirst: boolean = true;
    let groupName: string = '';
    this.group.clients.forEach(client => {
      if (!isFirst) {
        groupName += ' & ';
      }
      groupName += this.clientFunctions.getClientDisplayName(client);
      isFirst = false;
    });
    return groupName;
  }
  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
  getRemainingDummies(alreadyCreated: number): any[] {
    const result = [];
    for (let index = alreadyCreated; index < 5; index++) {
      result.push({});
    }
    return result;
  }
  getStreamIconUrl(stream: Stream): string {
    if (this.isSpotifyStream(stream)) {
      return 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg';
    }
    if (this.isBluetoothStream(stream)) {
      return 'https://upload.wikimedia.org/wikipedia/commons/d/da/Bluetooth.svg';
    }
    return '';
  }
  isStreamSelected(stream: Stream): boolean {
    return stream.id === this.group.stream_id;
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

  updateClientVolume(client: Client, percent: number) {
    this.clientFunctions.setClientMaxVolume(client, percent);
    client.config.volume.percent = Math.floor(percent * this.groupFunctions.getGroupVolume(this.group) / 100);
    this.snapcast.updateClientVolume(client);
  }
  updateGroupVolume(percent: number) {
    this.groupFunctions.setGroupVolume(this.group, percent);
    this.group.clients.forEach(client => {
      client.config.volume.percent = Math.floor(percent * this.clientFunctions.getClientMaxVolume(client) / 100);
      this.snapcast.updateClientVolume(client);
    });
  }
  toggleMute() {
    this.group.muted = !this.group.muted;
    this.snapcast.updateGroupMute(this.group);
  }
  toggleClientMute(client: Client) {
    client.config.volume.muted = !client.config.volume.muted;
    this.snapcast.updateClientVolume(client);
  }
  selectStream(stream: Stream) {
    this.group.stream_id = stream.id;
    this.snapcast.updateGroupStream(this.group);
  }
}
