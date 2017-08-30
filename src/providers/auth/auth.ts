import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Storage} from '@ionic/storage';
import {CommonProvider} from '../common/common';
import 'rxjs/add/operator/map';

//Constants
import {URL} from '../../constants';

//Types
import {ResponseServer} from '../../types';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

    constructor(public _http: Http, private storage: Storage, private sCommon: CommonProvider) {
        console.log('Hello AuthProvider Provider');
    }

    askCode(number: string): Promise<any> {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        return new Promise((resolve, reject) => {
            this._http.post(this.sCommon.getServerAddress() + URL.USERS.VALIDATION, ('number='+number), options)
                .toPromise().then((res: Response) => {
                    resolve(res.json());
                }).catch(error => {
                    reject(error);
                })
        });
    }
    
    signup(number: string, code:string): Promise<any> {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        return new Promise((resolve, reject) => {
            this._http.post(this.sCommon.getServerAddress() + URL.USERS.SIGNUP, ('number='+number+'&code='+code), options)
                .toPromise().then((res: Response) => {
                    resolve(res.json());
                }).catch(error => {
                    reject(error);
                })
        });
    }

}
