import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Group } from '../types/group';
import { SnapcastService } from '../services/snapcast.service';

@Component({
  selector: 'app-edit-group-dialog',
  templateUrl: './edit-group-dialog.component.html',
  styleUrls: ['./edit-group-dialog.component.scss']
})
export class EditGroupDialogComponent implements OnInit {
  group: Group;
  newName: string;
  constructor(private snapcast: SnapcastService, private dialogRef: MatDialogRef<EditGroupDialogComponent>, @Inject(MAT_DIALOG_DATA) group) {
    this.group = group;
    this.newName = this.group.name;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.group.name = this.newName;
    this.snapcast.updateGroupName(this.group);
    this.dialogRef.close();
  }

}
