import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClickOutsideModule } from 'ng-click-outside';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SnapcastService } from './services/snapcast.service';
import { FormsModule } from '@angular/forms';
import { EditClientDialogComponent } from './edit-client-dialog/edit-client-dialog.component';
import { GroupBottomSheetComponent } from './group-bottom-sheet/group-bottom-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    EditClientDialogComponent,
    GroupBottomSheetComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ClickOutsideModule,
  ],
  providers: [SnapcastService],
  bootstrap: [AppComponent],
  entryComponents: [
    EditClientDialogComponent,
    GroupBottomSheetComponent,
  ]
})
export class AppModule { }
