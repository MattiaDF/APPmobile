import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

//my providers
import {StorageProvider} from "../../providers/storage/storage"

//models
import {User} from "../../models/user"
import {Avatar} from "../../models/avatar"

//Constants
import {URL, STORAGE_KEYS} from '../../constants';

@Injectable()
export class UserProvider {

    constructor(public http: Http, private _storage: StorageProvider) {
        console.log('Hello UserProvider Provider');
    }

    save(user): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createUser(user).then(u => {
                this._storage.saveUser(u);
                resolve();
            }).catch(() => {
                reject();
            })
        });
    }

    createUser(user: any): Promise<User> {
        return new Promise((resolve, reject) => {
            this.createAvatar(user.id, user.token).then(avatar => {
                let u = new User(user, avatar);
                resolve(u);
            })
        })
    }

    createAvatar(id, token = null): Promise<Avatar> {
        return new Promise((resolve) => {
            if (token === null) {
                token = this.get().token;
            }
            let small = this._storage.getServerAddress() + URL.USERS.AVATAR + id + '?token=' + token + '&type=iconR&timestamp=' + Date.now();
            let src = this._storage.getServerAddress() + URL.USERS.AVATAR + id + '?token=' + token + '&type=icon&timestamp=' + Date.now();
            resolve(new Avatar(small, src));
        })
    }

    get(): User {
        return this._storage.getUser();
    }

    getAvatar(id): Avatar {
        let token = this.get().token;
        let small = this._storage.getServerAddress() + URL.USERS.AVATAR + id + '?token=' + token + '&type=iconR&timestamp=1' + Date.now();
        let src = this._storage.getServerAddress() + URL.USERS.AVATAR + id + '?token=' + token + '&type=icon&timestamp=1' + Date.now();
        return new Avatar(small, src);
    }

}
