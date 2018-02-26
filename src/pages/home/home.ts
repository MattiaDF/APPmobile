import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController, Platform, Events} from 'ionic-angular';
import {File} from '@ionic-native/file';



//my providers
import {UserProvider} from "../../providers/user/user";
import {ChatProvider} from "../../providers/chat/chat";
import {ContactProvider} from "../../providers/contact/contact";
import {WebSocketProvider} from "../../providers/web-socket/web-socket";

//models
import {Chat} from "../../models/chat";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    public chats: Array<Chat>;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public popoverCtrl: PopoverController,
        private sChat: ChatProvider,
        private sContact: ContactProvider,
        private sWebSocket: WebSocketProvider,
        public platform: Platform,
        public events: Events,

    ) {

    }

    ionViewDidLoad() {
        this.sContact.loadContacts().then((users) => {
            console.log('resolve 1')
            this.sChat.loadChats().then((chats) => {
                console.log('resolve 2')
                this.chats = this.sChat.chats;
                this.sContact.updateContacts().then(() => {
                    console.log('resolve 3')
                    this.sChat.updateRemoteChats().then(() => {
                        console.log('resolve 4')
                        this.sChat.remoteMessages();

                        this.events.subscribe('list_chat:changed', () => {
                            this.chats = this.sChat.chats;
                        })

                        this.platform.resume.subscribe(() => {
                            this.sChat.remoteMessages()
                        });


                    }).catch((errr) => console.log(errr, 'errore update home'))
                }).catch((errr) => console.log(errr, 'errore update home'))
            }).catch((errr) => console.log(errr, 'errore update home'))
        }).catch((errr) => console.log(errr, 'errore update home'))
        console.log('ionViewDidLoad HomePage');
    }

    //    ionViewWillEnter() {
    //    }


    //    ionViewWillUnload() {
    //    }

    presentPopover($event: any) {
        let popover = this.popoverCtrl.create('PopOverHomePage');
        popover.present({
            ev: $event
        });
    }

    toChat(chat) {
        this.navCtrl.push("ChatPage", {'chat': chat});

    }

    toSearch() {
        this.navCtrl.push("SearchPage");

    }

    addChat() {
        this.navCtrl.push("NewChatPage");

    }
    
    removeChat(chat){
        this.sChat.removeChat(chat).then(() => {
            this.chats.splice(this.chats.indexOf(chat),1);
        }).catch((err) => console.log(err, 'errore cacnellazione chat'));
    }
}
