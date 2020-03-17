import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Client } from '../types/client';

@Component({
  selector: 'app-client-info-dialog',
  templateUrl: './client-info-dialog.component.html',
  styleUrls: ['./client-info-dialog.component.scss']
})
export class ClientInfoDialogComponent implements OnInit {
  client: Client;
  constructor(@Inject(MAT_DIALOG_DATA) client) { this.client = client; }

  ngOnInit() {
  }

}
