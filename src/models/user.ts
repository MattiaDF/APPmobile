import {Avatar} from "../models/avatar";

export class User {

    public id: number = 0;
    public name: string = ''
    public token: string = '';
    public phone: string = '';
    public avatar: Avatar = null;
    public active_push: boolean = true;
    public isContact: boolean = false;
    public updated_at: Date;


    constructor(obj: any, avatar: Avatar) {
        this.avatar = avatar;
        this.setObj(obj);
    }

    setObj(obj?: any) {
        if (obj) {
            this.id = obj.id || this.id;
            this.name = obj.name || this.name;
            this.token = obj.token || this.token;
            this.phone = obj.phone || this.phone;
            this.active_push = obj.active_push || this.active_push;
            this.isContact = obj.isContact != 0 ;
            this.updated_at = obj.updated_at;
        }
    }

}