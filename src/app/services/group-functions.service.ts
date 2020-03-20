import { Injectable } from '@angular/core';
import { Group } from '../types/group';
import { SnapcastService } from './snapcast.service';

@Injectable({
  providedIn: 'root'
})
export class GroupFunctionsService {

  constructor(private snapcast: SnapcastService) { }
  setGroupVolume(group: Group, volume: number) {
    this.checkAndTransformGroup(group);
    group.name.volume = volume;
    this.snapcast.updateGroupName(group);
  }
  getGroupVolume(group: Group): number {
    this.checkAndTransformGroup(group);
    return group.name.volume;
  }
  private checkAndTransformGroup(group: Group) {
    if (!this.isGroupNameAnObject(group)) {
      this.transformGroupNameToObject(group);
    }
  }
  private isGroupNameAnObject(group: Group): boolean {
    if (group.name.volume !== undefined) {
      return true;
    }
    try {
      if (JSON.parse(group.name.split('\\"').join('"')).volume !== undefined) {
        group.name = JSON.parse(group.name.split('\\"').join('"'));
        return true;
      }
    } catch (error) {
    }

    return false;
  }
  private transformGroupNameToObject(group: Group) {
    group.name = {
      volume: 100
    };
    this.snapcast.updateGroupName(group);
  }
}
