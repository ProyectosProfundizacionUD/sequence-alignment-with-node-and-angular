import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlignSequenceComponent } from './home/align-sequence/align-sequence.component';
import { CreateSequenceComponent } from './home/create-sequence/create-sequence.component';
import { ListSequencesComponent } from './home/list-sequences/list-sequences.component';
import { SequenceComponent } from './home/sequence/sequence.component';

const routes: Routes = [
  {
    path: '',
    component: ListSequencesComponent,
    pathMatch: 'full',
  },
  {
    path: 'list-sequences',
    component: ListSequencesComponent,
    pathMatch: 'full',
  },
  {
    path: 'create-sequence',
    component: CreateSequenceComponent,
    pathMatch: 'full',
  },
  {
    path: 'align-sequence',
    component: AlignSequenceComponent,
    pathMatch: 'full',
  },
  {
    path: 'sequence/:identifier',
    component: SequenceComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
