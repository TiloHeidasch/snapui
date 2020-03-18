import { Component, Input } from '@angular/core';
import { Group } from '../types/group';
import { SnapcastService } from '../services/snapcast.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { GroupInfoDialogComponent } from '../group-info-dialog/group-info-dialog.component';
import { EditGroupDialogComponent } from '../edit-group-dialog/edit-group-dialog.component';
import { Server } from '../types/server';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss']
})
export class GroupItemComponent {
  @Input() group: Group;
  @Input() index: number;
  @Input() server: Server;
  @Input() allGroupDropLists;
  constructor(private snapcast: SnapcastService, private dialog: MatDialog) { }

  muteGroup(group: Group) {
    group.muted = !group.muted;
    this.snapcast.updateGroupMute(group);
  }

  infoGroup(group: Group) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = group;
    this.dialog.open(GroupInfoDialogComponent, dialogConfig);
  }

  editGroup(group: Group) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = group;
    this.dialog.open(EditGroupDialogComponent, dialogConfig);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const oldGroup = this.server.groups.find(group => group.id === event.previousContainer.id);
      if (oldGroup.clients.length === 0) {
        this.server.groups = this.server.groups.filter(group => group.id !== oldGroup.id);
      }
      this.snapcast.updateClientsInGroup(this.server.groups.find(group => group.id === event.container.id));
    }
  }
}
