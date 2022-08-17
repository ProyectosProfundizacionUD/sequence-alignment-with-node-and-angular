import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './home/header/header.component';
import { ListSequencesComponent } from './home/list-sequences/list-sequences.component';
import { CreateSequenceComponent } from './home/create-sequence/create-sequence.component';
import { AlignSequenceComponent } from './home/align-sequence/align-sequence.component';

//plotly
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
PlotlyModule.plotlyjs = PlotlyJS;

//Services
import { AlignService } from './services/align.service';
import { SequenceService } from './services/sequence.service';
import { UtilsService } from "./services/utils.service";

//imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';

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
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule,
    MatSelectModule,
    PlotlyModule,
  ],
  providers: [ AlignService, SequenceService, UtilsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
