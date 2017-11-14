import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

import {User} from "../../models/user";
import {SingleChat} from "../../models/chat";
import {ContactProvider} from "../../providers/contact/contact";
import {ChatProvider} from "../../providers/chat/chat";

import { UUID } from 'angular2-uuid';

/**
 * Generated class for the NewChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-new-chat',
    templateUrl: 'new-chat.html',
})
export class NewChatPage {

    public contacts: Array<User> = [];
    public originalContacts: Array<User> = [];
    public inputValue: string = '';
    constructor(public navCtrl: NavController, public navParams: NavParams, private sContact: ContactProvider, private sChat: ChatProvider) {
        
        this.originalContacts = this.sContact.contactsList;
        this.contacts = this.originalContacts;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewChatPage');
    }
    
    onInput(event){
        console.log(this.inputValue, 'input');
        if (this.inputValue === ''){
            this.contacts = this.originalContacts;
            return;
        }else {
           this.contacts = [];
        }
        let c: User;
        for ( c of this.originalContacts){
            console.log(c.name.indexOf(this.inputValue), 'index');
            if (c.name.indexOf(this.inputValue) >= 0){
                this.contacts.push(c);
            }
        }
        console.log(event, this.contacts);
    }
    
    
    toChat(user){
        let token =  UUID.UUID();
        let date = Date.now();
        let obj = {
            token : token, created_at : date, updated_at: date
        };
        let chat = new SingleChat(user, obj);
        console.log(obj, 'obj', chat, user)
        this.sChat.saveSingleChat(chat).then((savedChat) => {
            this.sChat.chats.push(savedChat);
            this.navCtrl.push("ChatPage", {'chat': savedChat});
        });
        console.log(user);
    }

}
