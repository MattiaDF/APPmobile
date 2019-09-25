import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';

//models
import {User} from "../../models/user";
import {Avatar} from "../../models/avatar";

import {URL_BASE, URL, STORAGE_KEYS} from '../../constants';

@Injectable()
export class StorageProvider {

    private server_address: string;
    private websocket_address: string;
    private user: User = null;

    constructor(public http: Http, public storage: Storage) {
        console.log('Hello StorageProvider Provider');

        if (!this.server_address || !this.user) {
            this.storage.get(STORAGE_KEYS.SERVER_ADDRESS).then((value) => {
                this.server_address = value;
            });
            this.storage.get(STORAGE_KEYS.WEBSOCKET_ADDRESS).then((value) => {
                this.websocket_address = value;
            });
            this.storage.get(STORAGE_KEYS.USER).then((value) => {
                console.log(value, 'user storage');
                if (value != null) {
                    this.user = new User(value, new Avatar(value.avatar.small, value.avatar.src));
                }
            });
        }
    }

    saveServerAddress(address: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.set(STORAGE_KEYS.SERVER_ADDRESS, 'http://' + address + URL_BASE.API).then(() => {
                this.server_address = 'http://' + address + URL_BASE.API;
                this.storage.set(STORAGE_KEYS.WEBSOCKET_ADDRESS, address + URL_BASE.WEBSOCKET).then(() => {
                    this.websocket_address = address + URL_BASE.WEBSOCKET;
                    resolve();

                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                reject();
            });
        });
    }
    saveUser(user: User) {
        return new Promise((resolve, reject) => {
            this.storage.set(STORAGE_KEYS.USER, user)
                .then(() => {
                    this.user = user;
                    console.log("saved in a storage")
                    resolve();
                })
                .catch(() => {
                    console.log("saving in a storage error")
                    reject();
                });
        });
    }


    getServerAddress() {
        if (this.server_address != null) {
            return this.server_address;
        } else {
            this.storage.get(STORAGE_KEYS.SERVER_ADDRESS).then((address) => {
                this.server_address = address;
                return this.server_address;
            })
        }
    }

    getWebSocketAddress(): Promise<string> {
        return new Promise((resolve) => {
            if (this.user != undefined && this.websocket_address != undefined) {
                resolve(this.websocket_address + this.user.token);
            } else {
                this.storage.get(STORAGE_KEYS.USER).then((user) => {
                    this.user = user;
                    this.storage.get(STORAGE_KEYS.WEBSOCKET_ADDRESS).then((value) => {
                        this.websocket_address = value;
                        resolve(this.websocket_address + this.user.token);
                    });
                });
            }
        });
    }

    getUser() {
        if (this.user != null) {
            return this.user;
        } else {
            this.storage.get(STORAGE_KEYS.USER).then((user) => {
                this.user = user;
                return this.user;
            })
        }
    }



}
