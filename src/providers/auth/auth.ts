import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {StorageProvider} from '../storage/storage';
import 'rxjs/add/operator/map';

//Constants
import {URL} from '../../constants';

@Injectable()
export class AuthProvider {

    constructor(public _http: Http, private sStorage: StorageProvider) {
        console.log('Hello AuthProvider Provider');
    }

    askCode(number: string): Promise<any> {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        return new Promise((resolve, reject) => {
            console.log(this.sStorage.getServerAddress() + URL.USERS.VALIDATION);
            this._http.post(this.sStorage.getServerAddress() + URL.USERS.VALIDATION, ('number='+number), options)
                .toPromise().then((res: Response) => {
                    console.log("topromise then");
                    resolve(res.json());
                }).catch(error => {
                    console.log("topromise catch", error);
                    reject(error);
                })
        });
    }
    
    signup(number: string, code:string): Promise<any> {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});
        return new Promise((resolve, reject) => {
            this._http.post(this.sStorage.getServerAddress() + URL.USERS.SIGNUP, ('number='+number+'&code='+code), options)
                .toPromise().then((res: Response) => {
                    resolve(res.json());
                }).catch(error => {
                    reject(error);
                })
        });
    }

}
