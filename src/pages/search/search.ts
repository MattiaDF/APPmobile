import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

//my models 
import {User} from "../../models/user";
import {Chat, SingleChat} from "../../models/chat";

//my providers
import {ContactProvider} from "../../providers/contact/contact";
import {ChatProvider} from "../../providers/chat/chat";
import {UserProvider} from "../../providers/user/user";

import {UUID} from 'angular2-uuid';



/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {

    public contacts: Array<User> = [];
    public originalContacts: Array<User> = [];

    public chats: Array<Chat> = [];
    public originalChats: Array<Chat> = [];

    public inputValue: string = '';

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public sContact: ContactProvider,
        public sChats: ChatProvider,
        private sUser: UserProvider
    ) {

        let list = this.sContact.contactsList.slice();
        
        console.log(list , 'list slice' );
        let io = this.sContact.getUser(this.sUser.get().id);
         list.splice(list.indexOf(io), 1);
         this.originalContacts = list;
        console.log(this.originalContacts , 'originalContacts splice' );
        console.log(list , 'list POST splice' );


        this.contacts = this.originalContacts;
        this.originalChats = this.sChats.chats;
        this.chats = this.originalChats;
    }

    onInput(event) {
        console.log(this.inputValue, 'input');
        if (this.inputValue === '') {
            this.contacts = this.originalContacts;
            this.chats = this.originalChats;
            return;
        } else {
            this.contacts = [];
            this.chats = [];
        }
        let u: User;
        for (u of this.originalContacts) {
            if (u.name.indexOf(this.inputValue) >= 0) {
                this.contacts.push(u);
            }
        }
        let c: Chat;
        for (c of this.originalChats) {
            if (c.getName().indexOf(this.inputValue) >= 0) {
                this.chats.push(c);
            }
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }

    toChat(chat) {
        this.navCtrl.push("ChatPage", {'chat': chat});
    }

    clickContact(user) {
        let token = UUID.UUID();
        let date = Date.now();
        let obj = {
            token: token, created_at: date, updated_at: date
        };
        let chat = new SingleChat(user, obj);
        console.log(obj, 'obj', chat, user)
        this.sChats.saveSingleChat(chat).then((savedChat) => {
            this.sChats.chats.push(savedChat);
            this.navCtrl.push("ChatPage", {'chat': savedChat});
        });
        console.log(user);
    }

}
