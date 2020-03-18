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
  constructor(private messageService: MessageService, private snapcast: SnapcastService, private dialog: MatDialog) {
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.messageService.on<string>('SnapcastServerUpdate').subscribe(server => {
      console.log(server);
      this.server = server;
    })
  }
}
