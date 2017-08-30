import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the CommonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CommonProvider {
    
   private server_address : string;

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello CommonProvider Provider');
    this.storage.get('server_address').then((value) => {
        this.server_address = value;
    })
    
  }
  
  
  getServerAddress(){
      return this.server_address;
  }

}
