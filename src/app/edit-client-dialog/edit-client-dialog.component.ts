import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Client } from '../types/client';
import { SnapcastService } from '../services/snapcast.service';

@Component({
  selector: 'app-edit-client-dialog',
  templateUrl: './edit-client-dialog.component.html',
  styleUrls: ['./edit-client-dialog.component.scss']
})
export class EditClientDialogComponent implements OnInit {
  client: Client;
  newName: string;
  constructor(private snapcast: SnapcastService, private dialogRef: MatDialogRef<EditClientDialogComponent>, @Inject(MAT_DIALOG_DATA) client) {
    this.client = client;
    this.newName = this.client.config.name;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.client.config.name = this.newName;
    this.snapcast.updateClientName(this.client);
    this.dialogRef.close();
  }

}
