import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Client } from '../types/client';
import { SnapcastService } from '../services/snapcast.service';
import { ClientFunctionsService } from '../services/client-functions.service';

@Component({
  selector: 'app-edit-client-dialog',
  templateUrl: './edit-client-dialog.component.html',
  styleUrls: ['./edit-client-dialog.component.scss']
})
export class EditClientDialogComponent implements OnInit {
  client: Client;
  newName: string;
  newIcon: string;
  constructor(private clientFunctions: ClientFunctionsService, private snapcast: SnapcastService, private dialogRef: MatDialogRef<EditClientDialogComponent>, @Inject(MAT_DIALOG_DATA) client) {
    this.client = client;
    this.newName = clientFunctions.getClientDisplayName(client);
    this.newIcon = clientFunctions.getClientIcon(client);
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.clientFunctions.setClientDisplayName(this.client, this.newName);
    this.clientFunctions.setClientIcon(this.client, this.newIcon);
    this.snapcast.updateClientName(this.client);
    this.dialogRef.close();
  }
  setNewIcon(icon: string) {
    this.newIcon = icon;
  }
}
