import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './home/header/header.component';
import { ListSequencesComponent } from './home/list-sequences/list-sequences.component';
import { CreateSequenceComponent } from './home/create-sequence/create-sequence.component';
import { AlignSequenceComponent } from './home/align-sequence/align-sequence.component';

//Services
import { AlignService } from './services/align.service';
import { SequenceService } from './services/sequence.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//imports
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SequenceComponent } from './home/sequence/sequence.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListSequencesComponent,
    CreateSequenceComponent,
    AlignSequenceComponent,
    SequenceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [ AlignService, SequenceService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
