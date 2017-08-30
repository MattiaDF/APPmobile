import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

//models
import {User} from "../../models/user";

//Constants
import {URL_BASE, URL, STORAGE_KEYS} from '../../constants';

@Injectable()
export class UserProvider {
    
    private _user: User = null;

  constructor(public http: Http, private _storage: Storage) {
    console.log('Hello UserProvider Provider');
  }
  
  save(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this._storage.set(STORAGE_KEYS.USER, user)
                .then(() => {
                    console.log("saved in a storage")
                    resolve();
                })
                .catch(() => {
                    reject();
                });
        });
    }
    
    get(): Promise<User> {
        return new Promise((resolve, reject) => {
            this._storage.get(STORAGE_KEYS.USER)
                .then((user) => {
                    if (user !== null) {
                        resolve(new User(user));
                    } else {
                        reject();
                    }
                })
        });
    }
    
    update(): Promise<User> {
        return new Promise((resolve, reject) => {
            
        })
    }

}
