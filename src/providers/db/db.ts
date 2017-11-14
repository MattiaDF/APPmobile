import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {User} from "../../models/user";

import {Platform} from 'ionic-angular';

import {PRODUCTION} from '../../constants';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

declare var window: any;

@Injectable()
export class DbProvider {

    private storage: any;
    private isOpen: boolean = false;

    constructor(private sqlite: SQLite, public platform: Platform) {
        console.log('Hello DbProvider Provider');
        if (!this.isOpen) {
            this.createStorage();
        }
    }

    private createStorage(): Promise<any> {

        return new Promise((resolve, reject) => {
            if (this.platform.is('core')) {
                console.log('web');
                this.storage = window.openDatabase("data.db", "1.0", "MyChat", -1);
                this.isOpen = true;
                this.createTable();
                resolve();
            } else {
                console.log('mysqlite');
                this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
                    this.storage = db;
                    this.isOpen = true;
                    console.log('db aperto', this.storage)
                    this.createTable().then(() => {
                        console.log('table create');
                        resolve();
                    }).catch(() => {
                        console.log('table NON create')
                        reject();
                    });;
                });
            }
        });
    }


    createTable(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.transaction(function (tx) {
//                if (!PRODUCTION) {
//                    tx.executeSql('drop table IF EXISTS users');
//                    tx.executeSql('drop table IF EXISTS chats');
//                    tx.executeSql('drop table IF EXISTS partecipants');
//                    tx.executeSql('drop table IF EXISTS messages');
//                }
                tx.executeSql('create table IF NOT EXISTS users(id INTEGER(10), name VARCHAR(32) NULL, phone VARCHAR(10), active_push INTEGER(1), updated_at TEXT NULL, is_contact INTEGER(1))');
                tx.executeSql('create table IF NOT EXISTS chats(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50) NULL, token VARCHAR(64), created_at TEXT, url_img VARCHAR(100) NULL, updated_at TEXT NULL, type INTEGER(1))')
                tx.executeSql('create table IF NOT EXISTS participants(user_id INTEGER(10), chat_token VARCHAR(64))');
                tx.executeSql('create table IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT, type INTEGER(1), text TEXT NULL, created_at TEXT, chat_token VARCHAR(64), sender_id INTEGER(10) NULL, media_url VARCHAR(500) NULL, received INTEGER(1))');
            }).then(() => {
                resolve();
            }).catch(() => {
                reject();
            })
        });
    }

    query(q: string, params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.isOpen) {
                this.createStorage().then(() => {
                    this.executeQueryDb(q, params).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    })
                })
            } else {
                this.executeQueryDb(q, params).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                })
            }
        })

    }

    executeQueryDb(q: string, params?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            params = params || [];
            this.storage.transaction((tx) => {
                tx.executeSql(q, params, (tx, res) => {
                    resolve(res);
                }, (tx, err) => {
                    reject(err);
                });
            });
        });
    }

    getTransaction() {
        this.storage.transaction((tx) => {
            return tx;
        })
    }

}
