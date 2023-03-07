import { AppSettings } from '@app/shared/constants/appSettings';
import { Injectable } from '@angular/core';
import { sp, Web } from '@pnp/sp';


@Injectable({
  providedIn: 'root'
})
export class SharepointService {
  private web: Web;

  constructor() {
    sp.setup(AppSettings.pnpConfig);
    this.web = sp.web;
  }







  }
