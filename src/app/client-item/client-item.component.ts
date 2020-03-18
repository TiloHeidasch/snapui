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
  constructor(private snapcast: SnapcastService, private dialog: MatDialog) { }


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
