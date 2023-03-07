import { Component } from '@angular/core';
import { IDocument, Document } from './IInterfaces';
import { DocumentRespository } from './state.repository';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


items = new Array(10);

  constructor(public docRepo: DocumentRespository) {

  }
}
