import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

import {Contacts} from '@ionic-native/contacts';

//my providers
import {StorageProvider} from '../../providers/storage/storage';
import {DbProvider} from '../../providers/db/db';
import {UserProvider} from '../../providers/user/user';

//constants
import {URL} from '../../constants';

//models
import {User} from "../../models/user";



/*
  Generated class for the ContactProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactProvider {

    contactsList: Array<User> = [];

    constructor(public http: Http,
        private sStorage: StorageProvider,
        private sDb: DbProvider,
        private sUser: UserProvider,
        private _contacts: Contacts) {
        console.log('Hello ContactProvider Provider');
    }

    //new code

    loadContacts(): Promise<Array<User>> {
        return new Promise((resolve) => {
            this.sDb.query("SELECT * FROM users").then((res) => {
                let arrayPromise = [];
                console.log("numero contatti in db ", res.rows.length)
                for (var i = 0; i < res.rows.length; i++) {
                    let item = res.rows.item(i);
                    arrayPromise.push(new Promise((resolve) => {
                        let avatar = this.sUser.getAvatar(item.id);
                        resolve(new User(item, avatar));
                    }));
                }

                Promise.all(arrayPromise).then((users) => {
                    this.contactsList = users;
                    console.log('lista contatti caricati ', users);
                    resolve(users);
                })
            })
        })
    }


    getUser(id): User {
        console.log('find by id', id)
        for (let user of this.contactsList) {
            if (user.id === id) {
                return user;
            }
        }

        return null;
    }

    //    findById(id): Promise<User> {
    //        console.log('find by id', id)
    //
    //        return new Promise((resolve, reject) => {
    //            if (this.contactsList.length > 0) {
    //                for (let user of this.contactsList) {
    //                    if (user.id === id) {
    //                        resolve(user);
    //                    }
    //                }
    //            } else {
    //                reject('contact list vuota')
    //            }
    //
    //
    //            //            this.sDb.query('SELECT * FROM users where id = ?', [id]).then((res) => {
    //            //                if (res.rows.length > 0) {
    //            //                    let item = res.rows.item(0);
    //            //                    this.sUser.createUser(item).then(user => {
    //            //                        resolve(user);
    //            //                    })
    //            //                } else {
    //            //                    console.log('error else');
    //            //                    reject('errror else');
    //            //                }
    //            //
    //            //            }).catch((error) => {
    //            //                console.log('error catch find by id', error);
    //            //                reject(error);
    //            //            });
    //        });
    //    }

    //    findByNumber(phone): Promise<User> {
    //        console.log(phone, 'phone');
    //        return new Promise((resolve, reject) => {
    //
    //            if (this.contactsList.length > 0) {
    //                for (let user of this.contactsList) {
    //                    if (user.phone === phone) {
    //                        resolve(user);
    //                    }
    //                }
    //            } else {
    //                reject('contact list vuota')
    //            }
    //
    //            //            this.sDb.query('SELECT * FROM users where phone = ?', [phone]).then((res) => {
    //            //                if (res.rows.length > 0) {
    //            //                    let item = res.rows.item(0);
    //            //                    this.sUser.createUser(item).then(user => {
    //            //                        resolve(user);
    //            //                    })
    //            //                } else {
    //            //                    console.log('error else');
    //            //                    resolve(null);
    //            //                }
    //            //
    //            //            }).catch((error) => {
    //            //                console.log('error catch find by id', error);
    //            //                reject(error);
    //            //            });
    //
    //        })
    //    }

    saveContacts(): Promise<any> {
        console.log('save contacts')
        return new Promise((resolve, reject) => {
            this.getContacts().then((contacts) => {
                let list: Array<string> = [];

                for (let c of contacts) {
                    if (c.phoneNumbers && c.phoneNumbers[0].value.length >= 10) {
                        let phone = c.phoneNumbers[0].value;
                        phone = phone.replace('+39', '').trim();
                        phone = phone.split(" ").join("");
                        phone = phone.split("-").join("");
                        phone = phone.split("?").join("");
                        if (phone.length == 10) {
                            list.push(phone);
                        }
                    }
                }
                this.getRemoteContacts(list).then((remoteContacts: Array<User>) => {
                    this.saveContactInDb(remoteContacts).then(() => {
                        this.loadContacts().then(() => {
                            resolve();
                        })
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                })
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    updateContacts():Promise<any> {
        return new Promise((resolve, reject) => {
            this.getContacts().then((contacts) => {
                let list: Array<string> = [];

                for (let c of contacts) {
                    if (c.phoneNumbers && c.phoneNumbers[0].value.length >= 10) {
                        let phone = c.phoneNumbers[0].value;
                        phone = phone.replace('+39', '').trim();
                        phone = phone.split(" ").join("");
                        phone = phone.split("-").join("");
                        phone = phone.split("?").join("");
                        if (phone.length == 10) {
                            list.push(phone);
                        }
                    }
                }
                this.getRemoteContacts(list).then((remoteContacts: Array<User>) => {
                    console.log("remote contacts update")
                    for (let user of remoteContacts) {
                    console.log("user in for update", user)
                        let contact = this.getUser(user.id);
                        if (contact == null) {
                            console.log("new user find")
                            this.saveSingleContact(user).then((res) => {
                                this.contactsList.push(user);
                            })
                        } else {
                            if (contact.updated_at < user.updated_at) {
                                console.log("execute update user");
                                this.updateSingleContact(user).then((res) => {
                                    contact.name = user.name;
                                    contact.avatar = user.avatar;
                                    contact.updated_at = user.updated_at;
                                })
                            }
                        }
                    }
                    resolve();
                }).catch((err) => {
                    reject(err);
                })
            }).catch((error) => {
                console.log(error);
            });
        })
    }

    getContacts() {
        return this._contacts.find(['displayName', 'name'], {});
    }

    getRemoteContacts(list: Array<string>): Promise<Array<User>> {
        console.log("get remote contacts")
        return new Promise((resolve, reject) => {
            this.http.post(this.sStorage.getServerAddress() + URL.USERS.CONTACTS, {'list': list})
                .toPromise()
                .then((res: Response) => {
                    let remoteList = res.json();
                    let users: Array<User> = [];
                    let list_id: Array<number> = [];
                    let arrayPromise = [];
                    for (let c of remoteList) {
                        if (list_id.indexOf(c.id) > -1) {
                            continue;
                        } else {
                            list_id.push(c.id);
                        }

                        arrayPromise.push(this.sUser.createUser(c));
                        this.sUser.createUser(c).then((u) => {
                            u.id = c.id;
                            u.isContact = true;
                            users.push(u);
                        })
                    }

                    Promise.all(arrayPromise).then((users) => {
                        resolve(users);
                    })
                })
                .catch((error) => {
                    reject('get remote contacts fail');
                });
        });
    }

    saveContactInDb(users: Array<User>): Promise<any> {
        console.log('remote contact saving', users)
        return new Promise((resolve, reject) => {
            this.sDb.query("DELETE FROM users WHERE is_contact = 1")
                .then(res => {
                    let promiseAll = [];
                    for (let user of users) {
                        console.log("sto salvando un contatto remoto");
                        promiseAll.push(this.saveSingleContact(user));
                    }

                    Promise.all(promiseAll).then(value => {
                        resolve()
                    }).catch(err => {
                        console.log(err, 'errore promise all')
                        reject();
                    })
                })
                .catch(err => {
                    console.log("Error DELETE contact: ", err);
                    reject(err);
                });
        });
    }
    saveSingleContact(user: User): Promise<User> {
        console.log("save single contact", user)
        return new Promise((resolve, reject) => {
            this.sDb.query("INSERT INTO users (id, name, phone, active_push, updated_at, is_contact) VALUES (?, ?, ?, ?,?, ?)",
                [user.id, user.name, user.phone, user.active_push, user.updated_at, user.isContact]).then(res => {
                    //                    this.contactsList.push(user);
                    resolve(user);
                })
                .catch(() => {
                    console.log('error saving users ');
                    reject();
                });
        })
    }

    updateSingleContact(user: User): Promise<User> {
        console.log("save single contact", user)
        return new Promise((resolve, reject) => {
            this.sDb.query("UPDATE  users SET name = ?, active_push = ?, updated_at = ?, is_contact = ? WHERE id = ?",
                [user.name, user.active_push, user.updated_at, user.isContact, user.id,]).then(res => {
                    //                    this.contactsList.push(user);
                    resolve(user);
                })
                .catch(() => {
                    console.log('error update users ');
                    reject();
                });
        })
    }

    //    getContactsList(): Promise<Array<User>> {
    //        return new Promise((resolve, reject) => {
    //            //            if (this.contactsList.length > 0) {
    //            //                console.log('contact list is populate and returned')
    //            //                resolve(this.contactsList);
    //            //            } else {
    //            console.log('contact list is NOT populate AND EXECUTE QUERY')
    //            this.sDb.query('SELECT * FROM users ', []).then((res) => {
    //                let arrayPromise = [];
    //                for (var i = 0; i < res.rows.length; i++) {
    //                    let item = res.rows.item(i);
    //                    arrayPromise.push(this.sUser.createUser(item));
    //                }
    //
    //                Promise.all(arrayPromise).then((users: Array<User>) => {
    //                    for (let u of users) {
    //                        this.contactsList.push(u);
    //                    }
    //                    resolve(this.contactsList);
    //                }).catch((err) => {
    //                    console.log("error array promise in get contact list", err);
    //                    reject(err);
    //                })
    //            }).catch((error) => {
    //                console.log('errore query select all users', error);
    //                reject(error);
    //            });
    //            //            }
    //        })
    //
    //    }


}
