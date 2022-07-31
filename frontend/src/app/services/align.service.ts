import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlignService {
  private env: String;
  constructor(private _httpClient: HttpClient) { 
    this.env =  environment.apiEndpoint;
  }
  
  align(data: any){
    return this._httpClient.post<any>(`${ this.env }align`, data);
  }
  alignWitOneSequence(data: any, identifier: String){
    return this._httpClient.post<any>(`${ this.env }align/${identifier}`, data);
  }
  async localAlign(data: any, entryHeaders: any){
    const response = await fetch(`${ this.env }align`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x1': entryHeaders.x1,
        'x2': entryHeaders.x2,
        'y1': entryHeaders.y1,
        'y2': entryHeaders.y2,
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  }
  async localAlignWitOneSequence(data: any, entryHeaders: any, identifier: String){
    const response = await fetch(`${ this.env }align/${identifier}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'x1': entryHeaders.x1,
        'x2': entryHeaders.x2,
        'y1': entryHeaders.y1,
        'y2': entryHeaders.y2,
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
  }
}
