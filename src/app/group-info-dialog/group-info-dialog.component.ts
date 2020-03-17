import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Group } from '../types/group';

@Component({
  selector: 'app-group-info-dialog',
  templateUrl: './group-info-dialog.component.html',
  styleUrls: ['./group-info-dialog.component.scss']
})
export class GroupInfoDialogComponent implements OnInit {
  group: Group;
  constructor(@Inject(MAT_DIALOG_DATA) group) { this.group = group; }

  ngOnInit() {
  }

}
