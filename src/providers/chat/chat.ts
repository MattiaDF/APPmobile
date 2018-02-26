import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Events} from 'ionic-angular';
import {File} from '@ionic-native/file';


import {UUID} from 'angular2-uuid';

//models
import {Avatar} from "../../models/avatar"
import {User} from "../../models/user"
import {Message} from "../../models/message"
import {Chat, ChatRoom, SingleChat} from '../../models/chat';

//my Providers
import {DbProvider} from '../../providers/db/db'
import {ContactProvider} from '../../providers/contact/contact'
import {UserProvider} from '../../providers/user/user'
import {StorageProvider} from '../../providers/storage/storage';
import {MediaProvider} from '../../providers/media/media';

import {URL} from '../../constants';

declare var navigator: any;

@Injectable()
export class ChatProvider {

    public chats: Array<Chat> = [];

    constructor(public _http: Http,
        private sDb: DbProvider,
        private sStorage: StorageProvider,
        private sContact: ContactProvider,
        private sUser: UserProvider,
        public events: Events,
        private sMedia: MediaProvider
    ) {
        console.log('Hello ChatProvider Provider');
        //evento per salvare un messaggio ricevuto
        this.events.subscribe('message:received', (obj: any) => {
            if (obj.message.owner.phone == this.sStorage.getUser().phone) {
                return;
            }

            console.log('message received on websocket called saveMessage');

            let type = '';
            console.log("type message: ", + obj.message.type)
            switch (+obj.message.type) {
                case 1:
                    type = 'foto';
                    break;
                case 2:
                    type = 'video';
                    break;
                case 3:
                    type = 'audio';
                    break;
            }
            this.sMedia.downloadMedia(obj.message.chatToken, obj.message.urlMedia, type).then((url) => {
                console.log("download finished")
                obj.message.urlMedia = url;
                this.saveRemoteMessage(obj.message).then(() => {
                    //                    this.events.publish('list_chat:changed');
                }).catch((err) => {
                    console.log("error in chat provider listener save messagwe")
                })
            })


        });
        this.events.subscribe('chatroom:received', (obj: any) => {
            if (this.getChat(obj.chat.token) == null) {
                this.saveChatRoom(obj.chat).then(() => {
                    this.loadChats().then(() => {
                        this.events.publish('list_chat:changed');
                    })
                })
            }
        });

    }


    //NEW CODE 

    createThumbnail(url): Promise<string> {
        return new Promise((resolve, reject) => {

            navigator.createThumbnail(url, function (err, imageData) {
                if (err) {
                    console.log(err);
                    reject(err)
                }

                console.log('success')
                return resolve("data:image/jpeg;base64," + imageData);
                //            return "data:image/jpeg;base64," + imageData;
            });
        })
    }

    updateChatRoom(chat: ChatRoom, url_img) {
        return new Promise((resolve) => {
            let file_name = this.createFileName('.jpg');
            this.sMedia.uploadImageChat(url_img, file_name, chat).then((res) => {
                chat.updated_at = Date.now();
                this.sDb.query("UPDATE chats SET name = ?, url_img = ?, updated_at = ? WHERE token = ?", [chat.name, file_name, chat.updated_at, chat.token]).then(() => {
                    let avatar = this.createAvatar(file_name, chat.token);
                    chat.avatar = avatar;
                    resolve(chat);
                }).catch((err) => {
                    console.log("errore update chatrom", err);
                })
            }).catch((err) => {
                console.log("error upadte chat room", err);
            })
        })
    }

    updateDbChatroom(chat) {
        return new Promise((resolve, reject) => {
            let this_chat = <ChatRoom> this.getChat(chat.token);
            if (!this_chat) {
                this.saveChatRoom(chat).then(() => {
                    this.sDb.query("SELECT * FROM chats WHERE token = ?", [chat.token]).then((res) => {
                        if (res.rows.length > 0) {
                            let item = res.rows.item(0);
                            this.loadParticipants(item.token).then((users) => {
                                this.loadMessages(item.token).then((mess) => {
                                    let chat = new ChatRoom(users, item, this.createAvatar(item.url_img, item.token));
                                    chat.messages = mess;
                                    this.chats.push(chat);
                                    resolve(chat);

                                }).catch((err) => {
                                    console.log("error load messages post updateChatroom")
                                    reject(err);
                                })
                            }).catch((err) => {
                                console.log("error load participants post updateChatroom")
                                reject(err);
                            })
                        } else {
                            console.log("error select chatroom post updatechat")
                            reject()
                        }
                    }).catch((err) => {
                        console.log("error select chatroom post updatechat")
                        reject(err);
                    })
                }).catch((err) => {
                    console.log("error saveChatRoom post updatechat")
                    reject(err);
                })
            } else {
                console.log('update chat cmd updated_at', this_chat.updated_at, chat.updated_at)
                if (this_chat.updated_at < chat.updated_at) {
                    this.sDb.query("UPDATE chats SET name = ?, url_img = ?, updated_at = ? WHERE token = ?", [chat.name, chat.urlImg, chat.updated_at, chat.token]).then(() => {
                        let avatar = this.createAvatar(chat.urlImg, chat.token);
                        this_chat.avatar = avatar;
                        this_chat.updated_at = chat.updated_at;
                        resolve(this_chat);
                    }).catch((err) => {
                        console.log("errore update chatrom", err);
                    })
                } else {
                    resolve();
                }
            }
        })
    }

    //return chat in list
    getChat(token): Chat {
        for (let chat of this.chats) {
            if (chat.token === token) {
                return chat;
            }
        }

        return null;
    }

    populateChat(c): Promise<Chat> {
        return new Promise((resolve) => {

            this.loadParticipants(c.token).then((participants) => {
                this.loadMessages(c.token).then((messages) => {
                    let chat: Chat;
                    if (c.type == 2) {
                        chat = new ChatRoom(participants, c, this.createAvatar(c.url_img, c.token));
                    } else {
                        chat = new SingleChat(participants[0], c)
                    }

                    chat.messages = messages;
                    resolve(chat);
                });
            });
        })
    }

    //populate list chats
    loadChats(): Promise<Array<Chat>> {
        return new Promise((resolve, reject) => {
            this.sDb.query('SELECT * FROM chats').then((res) => {
                let arrayPromise = [];
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        let c = res.rows.item(i);
                        arrayPromise.push(this.populateChat(c));
                    }

                    Promise.all(arrayPromise).then((chats) => {
                        this.chats = chats;
                        console.log("chats in load chats", chats)
                        resolve(this.chats);
                    })
                } else {
                    resolve([]);
                }
            })
        })
    }

    //return participants of chat
    loadParticipants(chat_token): Promise<Array<User>> {
        return new Promise((resolve) => {
            this.sDb.query("SELECT * FROM participants WHERE chat_token = ?", [chat_token]).then((res) => {
                let participants: Array<User> = [];
                for (var i = 0; i < res.rows.length; i++) {
                    let item = res.rows.item(i);
                    participants.push(this.sContact.getUser(item.user_id));
                }
                resolve(participants);
            })
        })
    }


    //return list messages in chat
    loadMessages(chat_token): Promise<Array<Message>> {
        return new Promise((resolve) => {
            this.sDb.query("SELECT * FROM messages WHERE chat_token = ?", [chat_token]).then((res) => {
                let messages: Array<Message> = [];
                for (var i = 0; i < res.rows.length; i++) {
                    let m = res.rows.item(i);
                    console.log('message result select', m)
                    let message = new Message(m);
                    message.media = m.media_url;
                    message.sender = this.sContact.getUser(m.sender_id);
                    console.log("message sender", message.sender)
                    if (message.type == 2) {
                        this.createThumbnail(message.media).then((baseImage) => {
                            message.thumbnail = baseImage;
                        }).catch((err) => {
                            console.log(err, 'errore creiozne thumbnail')
                        })
                    }
                    messages.push(message);
                }
                resolve(messages);
            })
        })
    }


    //populate db with remote message and update list contacts and/or chats
    remoteMessages() {
        return new Promise((resolve) => {

            let user = this.sUser.get();
            console.log('user in remote message', user)
            this._http.get(this.sStorage.getServerAddress() + URL.MESSAGES + '?token=' + user.token)
                .toPromise()
                .then((res: Response) => {
                    let mes = res.json();
                    let arrayPromise = [];
                    console.log(mes, 'mmess remote ')
                    if (mes == null || mes == undefined) {
                        resolve();
                    }
                    for (let message of mes) {
                        arrayPromise.push(this.downloadRemoteMedia(message));
                    }

                    Promise.all(arrayPromise).then(() => {
                        resolve();
                    })

                })
                .catch((err: Response) => console.log(err));
        })
    }

    downloadRemoteMedia(message){
        return new Promise( resolve => {
            let type = '';
            switch (+message.type) {
                case 1:
                    type = 'foto';
                    break;
                case 2:
                    type = 'video';
                    break;
                case 3:
                    type = 'audio';
                    break;
            }
        this.sMedia.downloadMedia(message.chatToken, message.urlMedia, type).then((url) => {
                console.log("download finished")
                message.urlMedia = url;
                this.saveRemoteMessage(message).then(() => {
                    //                    this.events.publish('list_chat:changed');
                }).catch((err) => {
                    console.log("error in chat provider listener save messagwe")
                })
            })
        });
    }



    saveRemoteMessage(message) {
        return new Promise((resolve) => {

            let owner_message = this.sContact.getUser(message.owner.id);
            if (!owner_message) {
                owner_message = new User(message.owner, this.sUser.getAvatar(message.owner.id));
                owner_message.isContact = false;
                this.sContact.contactsList.push(owner_message);
                console.log("non ho trovato il contatto e lo sto salvando", owner_message)
                this.sContact.saveSingleContact(owner_message);
            } else {
                //                console.log('owner updated_at', owner_message.updated_at.getTime(), 'message.owner.update_at', message.owner.update_at)
                //                if (owner_message.updated_at.getTime() < message.owner.update_at) {
                //                    this.sContact.updateSingleContact(owner_message).then(() => {
                //                        owner_message.updated_at = new Date();
                //                    })
                //                }
            }


            let chat = this.getChat(message.chatToken);
            if (chat == null) {
                let obj = {
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    token: message.chatToken,
                }
                chat = new SingleChat(owner_message, obj);
                this.chats.push(chat);
                this.saveSingleChat(<SingleChat> chat);
            }

            let m = {
                type: +message.type,
                sender: owner_message,
                text: message.text,
                media: message.urlMedia,
                created_at: message.created_at,
                received: 1
            };
            let new_message = new Message(m);
            if (new_message.type == 2) {
                this.createThumbnail(new_message.media).then((baseImage) => {
                    new_message.thumbnail = baseImage;
                }).catch((err) => {
                    console.log(err, 'errore creiozne thumbnail')
                })
            }
            this.saveInDbMessage(new_message, message.chatToken).then((id) => {
                new_message.id = id;
                chat.messages.push(new_message);
                resolve();
            })
        })
    }

    remoteChats() {
        return new Promise((resolve) => {
            var headers = new Headers();
            headers.append("Accept", 'application/json');
            headers.append('Content-Type', 'application/json');
            headers.append('token', this.sStorage.getUser().token);
            let options = new RequestOptions({headers: headers});
            this._http.get(this.sStorage.getServerAddress() + URL.USERS.CHATROOMS, options)
                .toPromise()
                .then((res: Response) => {
                    let remote_chats = res.json();
                    let arrayPromise = [];
                    for (let r_chat of remote_chats) {
                        arrayPromise.push(this.saveChatRoom(r_chat))
                    }
                    Promise.all(arrayPromise).then(() => {
                        resolve();
                    })
                })
                .catch((err: Response) => console.log(`Errore status: ${err.status}`));
        })
    }


    updateRemoteChats(): Promise<any> {
        return new Promise((resolve) => {
            var headers = new Headers();
            headers.append("Accept", 'application/json');
            headers.append('Content-Type', 'application/json');
            headers.append('token', this.sStorage.getUser().token);
            let options = new RequestOptions({headers: headers});
            this._http.get(this.sStorage.getServerAddress() + URL.USERS.CHATROOMS, options)
                .toPromise()
                .then((res: Response) => {
                    let remote_chats = res.json();
                    let arrayPromise = [];
                    for (let r_chat of remote_chats) {
                        arrayPromise.push(this.updateDbChatroom(r_chat))
                    }
                    Promise.all(arrayPromise).then(() => {
                        resolve();
                    })
                })
                .catch((err: Response) => console.log(`Errore status: ${err.status}`));
        })
    }

    saveChatRoom(chat): Promise<number> {
        return new Promise((resolve) => {
            let arrayPromise = [];
            let url = chat.urlImg || chat.avatar.url_img;
            console.log("url in save chat room", url)
            this.sDb.query("INSERT INTO chats (name, token, created_at, url_img, updated_at, type) VALUES (?, ?, ?, ?,?, 2)",
                [chat.name, chat.token, chat.created_at, url, chat.created_at])
                .then((res) => {
                    let insert_id = res.insertId;
                    for (let participant of chat.participants) {
                        let contact = this.sContact.getUser(participant.id);
                        if (contact == null) {
                            let user_model = new User(participant, this.sUser.getAvatar(participant.id));
                            user_model.isContact = false;
                            this.sContact.contactsList.push(user_model);
                            this.sContact.saveSingleContact(user_model);
                        }
                        arrayPromise.push(this.insertParticipant(participant, chat.token));
                    }

                    Promise.all(arrayPromise).then(() => {
                        resolve(insert_id);
                    })
                })
                .catch((err) => {
                    console.log('error saving chatroom ', err);
                });
        })
    }

    saveSingleChat(chat: SingleChat): Promise<SingleChat> {
        return new Promise((resolve) => {
            this.sDb.query("INSERT INTO chats (name, token, created_at, url_img, updated_at, type) VALUES (?, ?, ?, ?,?, 1)",
                [null, chat.token, chat.created_at, null, chat.created_at])
                .then((res) => {
                    chat.id = res.insertId;
                    this.insertParticipant(chat.participant, chat.token).then(() => {
                        resolve(chat);
                    })
                })
                .catch((err) => {
                    console.log('error saving chatroom ', err);
                });
        })
    }


    insertParticipant(user, token): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sDb.query("INSERT INTO participants (user_id, chat_token) VALUES (?, ?)",
                [user.id, token])
                .then(result => {
                    resolve()
                })
                .catch((err) => {
                    console.log('error saving chatroom ', err);
                    reject(err);
                });
        })
    }

    createAvatar(url, token): Avatar {
        let user_token = this.sStorage.getUser().token;
        let small = this.sStorage.getServerAddress() + URL.CHATS.AVATAR + token + '/' + url + '?token=' + user_token + '&type=iconR';
        let src = this.sStorage.getServerAddress() + URL.CHATS.AVATAR + token + '/' + url + '?token=' + user_token + '&type=icon';
        return new Avatar(small, src, url);
    }

    sendMessage(message: Message, chat: Chat): Promise<any> {
        return new Promise((resolve, reject) => {
            this.saveInDbMessage(message, chat.token).then((id) => {
                message.id = id;
                this.events.publish('message:created', message, chat);
                resolve();
            }).catch(() => {reject()})

        })
    }

    saveInDbMessage(message: Message, token: string): Promise<any> {
        console.log("save in db message", message)
        return new Promise((resolve, reject) => {
            this.sDb.query("INSERT INTO messages ( text, type, created_at, chat_token, sender_id, media_url, received) VALUES (?, ?, ?, ?, ?,?, ?)",
                [message.text, message.type, message.created_at, token, message.sender.id, message.media, message.received])
                .then((res) => {
                    console.log("resolve save in db message")
                    resolve(res.insertId);
                }).catch((error) => {
                    console.log(error, 'errore sendmessage');
                    reject();
                })

        })
    }

    createFileName(ext) {
        let icon_name = UUID.UUID();

        let a = icon_name.split('-');
        icon_name = '';
        for (let i of a) {
            icon_name += i
        }
        icon_name += ext;

        return icon_name;
    }

    newChatroom(name: string, image: string, participants: Array<User>): Promise<ChatRoom> {
        return new Promise((resolve, reject) => {
            let token = UUID.UUID();
            let icon_name = this.createFileName('.jpg');
            let obj = {
                created_at: Date.now(),
                name: name,
                token: token
            }

            let avatart = this.createAvatar(icon_name, token);
            let chat = new ChatRoom(participants, obj, avatart);

            this.sMedia.uploadMedia(image, icon_name, chat.token, "icon").then((res) => {
                //                this.events.publish('chatroom:created', chat, image);
                this.saveChatRoom(chat).then((id_chat) => {
                    chat.messages = [];
                    chat.id = id_chat;
                    console.log("chat room saved ", chat);
                    let self = this;
                    setTimeout(function () {
                        self.events.publish('chatroom:created', chat);
                        resolve(chat);
                    }, 1500)
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                })
            }).catch((err) => {
                console.log("error uploafd image chat", err);
                reject(err);
            })

        })
    }
    
        removeChat(chat: Chat) {
        return new Promise((resolve) => {
            let arrayPromise = [];
            arrayPromise.push(this.sDb.query("DELETE FROM participants WHERE chat_token = ?", [chat.token]));
            arrayPromise.push(this.sDb.query("DELETE FROM messages WHERE chat_token = ?", [chat.token]));
            arrayPromise.push(this.sDb.query("DELETE FROM chats WHERE token = ?", [chat.token]));

            Promise.all(arrayPromise).then(() => {
                resolve();
            }).catch((err) => {
                console.log("errore delete chat", err);
            })
        })
    }

}
