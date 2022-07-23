import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SequenceService } from 'src/app/services/sequence.service';
import {
  MatDialogModule,
  MatDialogConfig,
  MatDialog,
} from '@angular/material/dialog';

@Component({
  selector: 'app-list-sequences',
  templateUrl: './list-sequences.component.html',
  styleUrls: ['./list-sequences.component.css'],
})
export class ListSequencesComponent implements OnInit {
  sequences: any;
  textFiltered: string = '';
  filteredSequence: any[] = [];

  constructor(
    private _sequenceService: SequenceService,
    private _router: Router,
    private _matDialog: MatDialog
  ) {
    this.sequences = [];
  }

  ngOnInit(): void {
    this._sequenceService.listSequence().subscribe(
      (res) => {
        this.sequences = res;
        this.filteredSequence = res;
      },
      (error) => {
        console.log(error); //! por cambiar!!!
      }
    );
  }

  filteredWords() {
    this.filteredSequence = this.sequences.filter(
      (sequence: any) =>
        sequence.organism
          .toLocaleLowerCase()
          .includes(this.textFiltered.toLocaleLowerCase()) ||
        sequence.identifier
          .toLocaleLowerCase()
          .includes(this.textFiltered.toLocaleLowerCase())
    );
  }

  enterToSequence(identifier: any) {
    this._router.navigate([`sequence/${identifier}`]);
  }

  deleteSequence(identifier: any) {}

  onCreate() {}
}
