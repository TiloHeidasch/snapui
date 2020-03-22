import { Component } from '@angular/core';
import { MessageService } from './services/message.service';
import { SnapcastService } from './services/snapcast.service';
import { Server } from './types/server';
import { Group } from './types/group';
import { MatDialog, MatDialogConfig, MatBottomSheet, MatBottomSheetConfig } from '@angular/material';
import { GroupBottomSheetComponent } from './group-bottom-sheet/group-bottom-sheet.component';
import { Client } from './types/client';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';
import { ClientFunctionsService } from './services/client-functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'snapui';
  server: Server = null;
  allGroupDropLists = [];
  activeGroup: Group = null;
  clientFunctions: ClientFunctionsService;
  constructor(private clientFunctionsService: ClientFunctionsService, private messageService: MessageService, private snapcast: SnapcastService, private dialog: MatDialog, private _bottomSheet: MatBottomSheet) {
    this.clientFunctions = clientFunctionsService;
  }
  ngOnInit(): void {
    this.messageService.on<string>("SnapcastShutdown").subscribe(() => {
      this.server = null;
    })
    this.messageService.on<string>('SnapcastServerUpdate').subscribe(server => {
      if (!environment.production) console.log(server);
      this.server = server;
      this.allGroupDropLists = [...this.server.groups.map(group => group.id), 'outtop', 'outside1', 'outside2', 'outend'];
    })
  }
  click(group: Group) {
    this.activeGroup = group;
    if (group !== null) {
      this.openBottomSheet();
    } else {
      this._bottomSheet.dismiss();
    }
  }
  isGroupActive(group: Group): boolean {
    return group === this.activeGroup;
  }
  openBottomSheet(): void {
    const config = new MatBottomSheetConfig();
    config.hasBackdrop = false;
    config.data = { group: this.activeGroup, server: this.server };
    config.panelClass = "bottomSheetContainer"
    this._bottomSheet.open(GroupBottomSheetComponent, config);
  }

  editClient(client: Client) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = client;
    dialogConfig.panelClass = 'editClientDialog';
    dialogConfig.backdropClass = 'blackout';
    this.dialog.afterAllClosed.subscribe(() => this.openBottomSheet());
    this.dialog.afterOpen.subscribe(() => this._bottomSheet.dismiss());
    this.dialog.open(EditClientDialogComponent, dialogConfig);
  }
  dragEnd(event) {
    this._bottomSheet.dismiss();
    this.activeGroup = null;
    if (event.previousContainer === event.container) {
      //nothing to do
    } else {
      //we have work to do
      const previousGroup = this.findGroupById(event.previousContainer.id);
      const client: Client = previousGroup.clients[event.previousIndex];
      previousGroup.clients = previousGroup.clients.filter(checkedClient => checkedClient.id !== client.id);
      if (event.container.id.startsWith('out')) {
        //we want the client to be in its own new group
        //we create a dummy group for the client to sit in, until we recieve the proper group from remote
        this.server.groups.push({
          clients: [client],
          id: 'dummy',
          muted: false,
          name: 'dummy',
          stream_id: this.server.streams[0].id,
        });
        this.snapcast.updateClientsInGroup(previousGroup);
      } else {
        //we want the client to join another group
        const targetGroup: Group = this.findGroupById(event.container.id);
        targetGroup.clients.push(client);
        this.snapcast.updateClientsInGroup(targetGroup);
      }
    }
  }
  private findGroupById(id: string): Group {
    return this.server.groups.find(group => group.id === id);
  }
}