import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Events, Platform} from 'ionic-angular';
import {Vibration} from '@ionic-native/vibration';
import {Badge} from '@ionic-native/badge';

//my providers
import {StorageProvider} from '../storage/storage';

//my model
import {Message} from '../../models/message';
import {Chat, SingleChat, ChatRoom} from '../../models/chat';

/*
  Generated class for the WebSocketProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WebSocketProvider {

    public websocket: WebSocket;
    public websocket_url: string;

    constructor(public http: Http, private sStorage: StorageProvider, public events: Events,
        public platform: Platform, private vibration: Vibration, private badge: Badge) {

        platform.ready().then(() => {
            this.sStorage.getWebSocketAddress().then((address) => {
                this.websocket_url = "ws://" + address;
                console.log('Hello WebSocketProvider Provider', address);
                this.connect(this);
            }).catch(err => {
                console.log(err);
            })


            this.platform.pause.subscribe(() => {
                this.events.subscribe('foreground:message', () => {
                    this.badge.increase(1);
                    console.log('increase badge');
                })
            });
            //            this.platform.pause.subscribe(() => {
            //                console.log('[INFO] App paused');
            //                this.websocket.close();
            //            });
            //
            //            this.platform.resume.subscribe(() => {
            //                this.connect(this);
            //                console.log('[INFO] App resumed');
            //            });
            //            
            this.platform.resume.subscribe(() => {
                this.badge.clear();
                console.log('clear badge');
                this.events.unsubscribe('foreground:message');
            });
        });


        console.log('Hello WebSocketProvider Provider');

    }

    sendMessage(self, message: Message, chat: Chat) {
        if (this.websocket.readyState === this.websocket.CLOSED) {
            this.events.unsubscribe('message:created');
            this.events.unsubscribe('chatroom:created');
            this.connect(self);
        }
        let participants = [];
        if (chat instanceof ChatRoom) {
            console.log("chatroom created")
            for (let user of chat.participants) {
                participants.push(user.id);
            }
        }
        if (chat instanceof SingleChat) {
            participants.push(chat.participant.id);
        }
        let media = '';
        if (message.media != null) {
            let array: Array<string> = message.media.split('/');
            media = array[array.length - 1];
        }

        console.log(message, 'stampa message in websocket')
        let payload = {
            action: "message",
            type: message.type,
            users: participants,
            url_media: media,
            text: message.text,
            chat: chat.token,
            created_at: message.created_at
        }

        console.log(payload, 'stampa payload');
        console.log(payload.users, 'stampa partecianti');
        this.websocket.send(JSON.stringify(payload));

    }

    sendNewChatRoom(self, chat: ChatRoom) {

        if (this.websocket.readyState === this.websocket.CLOSED) {
            console.log("socket chiusa in sendNewchatroom")
            this.events.unsubscribe('message:created');
            this.events.unsubscribe('chatroom:created');
            this.connect(self);
        }

        return new Promise((resolve, reject) => {

            console.log("web socket new chat", chat)
            let participants = [];
            for (let user of chat.participants) {
                participants.push(user.id);
            }

            console.log(chat, 'stampa chat in websocket')

            let payload = {
                action: "chatroom",
                type: '',
                users: participants,
                url_media: chat.avatar.url_img,
                text: chat.getName(),
                chat: chat.token,
                created_at: chat.created_at
            }
            this.websocket.send(JSON.stringify(payload));
            resolve();
        })

    }

    connect(self) {

        this.websocket = new WebSocket(this.websocket_url);

        this.websocket.onopen = function (event) {
            self.events.subscribe('message:created', (message: Message, chat: Chat) => {
                self.sendMessage(self, message, chat);
                console.log('message sended on websocket');
            });

            self.events.subscribe('chatroom:created', (chat: ChatRoom) => {
                self.sendNewChatRoom(self, chat).then(() => {
                    console.log('message sended on websocket');

                }).catch((error) => {
                    console.log('err', error)
                })
            });
            console.log("web socket aperta");
        };

        this.websocket.onerror = function (event) {
            console.log("conneassione caduta");
            self.events.unsubscribe('message:created');
            self.events.unsubscribe('chatroom:created');
            //            self.connect(self);
        };

        this.websocket.onclose = function (event) {
            console.log("connessione chiusa");
            self.events.unsubscribe('message:created');
            self.events.unsubscribe('chatroom:created');
            //            self.connect(self);

        };
        this.websocket.onmessage = function (event) {
            let res = JSON.parse(event.data);
            if (res.action === "message") {
                console.log(event.data, 'messsage onmessage', res);
                self.events.publish('message:received', res);
                self.events.publish('foreground:message');
                self.vibration.vibrate([150, 100, 150]);
            } else {
                console.log(res, "message receveid remote chat")
                self.events.publish('chatroom:received', res);
            }
        }

    }
}
