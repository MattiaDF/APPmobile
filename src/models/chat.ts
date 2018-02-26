/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
import {User} from "../models/user";
import {Message} from "../models/message";
import {Avatar} from "../models/avatar";

//type = 1 singlechat, 2 = chatroom

export abstract class Chat {

    public id: number = 0;
    public token: string = '';
    public created_at: number;
    public updated_at: number;
    
    public messages: Array<Message> = [];


    constructor(obj?: any) {
        this.setObj(obj);
    }

    setObj(obj?: any) {
        if (obj) {
            this.id = obj.id || this.id;
            this.token = obj.token || this.token;
            this.created_at = obj.created_at;
            this.updated_at = obj.updated_at;
        }
    }
    
    abstract getAvatar(): Avatar;
    abstract getName(): string;
    
}


export class SingleChat extends Chat {

    public participant: User = null;

    constructor(user?: User, obj?: any) {
        super(obj);
        this.participant = user || this.participant;
    }
    
    getAvatar(){
        return this.participant.avatar;
    }
    getName(){
        if (this.participant.name == '' || this.participant.name == undefined){
            return this.participant.phone;
        }
        return this.participant.name;
    }

}

export class ChatRoom extends Chat {

    public name: string = '';
    public avatar: Avatar = null;
    public participants: Array<User> = null;

    constructor(users?: Array<User>, obj?: any, avatar?: Avatar) {
        super(obj);
        this.participants = users || this.participants;
        this.name = obj.name || this.name;
        this.avatar = avatar;
    }
    
    getAvatar(){
        return this.avatar;
    }
    
    getName(){
        return this.name;
    }
    
}
