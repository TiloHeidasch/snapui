import { Component, OnInit, Input } from '@angular/core';
import { SnapcastService } from '../services/snapcast.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Client } from '../types/client';
import { ClientInfoDialogComponent } from '../client-info-dialog/client-info-dialog.component';
import { EditClientDialogComponent } from '../edit-client-dialog/edit-client-dialog.component';

@Component({
  selector: 'client-item',
  templateUrl: './client-item.component.html',
  styleUrls: ['./client-item.component.scss']
})
export class ClientItemComponent {
  @Input() client: Client;
  volumeStep: number = 5;
  constructor(private snapcast: SnapcastService, private dialog: MatDialog) { }


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
  infoClient(client: Client) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = client;
    this.dialog.open(ClientInfoDialogComponent, dialogConfig);
  }
  editClient(client: Client) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = client;
    this.dialog.open(EditClientDialogComponent, dialogConfig);
  }

}
