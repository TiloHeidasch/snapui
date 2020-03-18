import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SnapcastService } from './services/snapcast.service';
import { FormsModule } from '@angular/forms';
import { ClientInfoDialogComponent } from './client-info-dialog/client-info-dialog.component';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';
import { EditGroupDialogComponent } from './edit-group-dialog/edit-group-dialog.component';
import { GroupInfoDialogComponent } from './group-info-dialog/group-info-dialog.component';
import { GroupItemComponent } from './group-item/group-item.component';
import { StreamSelectionComponent } from './stream-selection/stream-selection.component';
import { ClientItemComponent } from './client-item/client-item.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupInfoDialogComponent,
    ClientInfoDialogComponent,
    EditClientDialogComponent,
    EditGroupDialogComponent,
    GroupItemComponent,
    StreamSelectionComponent,
    ClientItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
  ],
  providers: [SnapcastService],
  bootstrap: [AppComponent],
  entryComponents: [ClientInfoDialogComponent, EditClientDialogComponent, EditGroupDialogComponent, GroupInfoDialogComponent]
})
export class AppModule { }
