
import {User} from "../models/user";

export class Message {
    
    //type = 0 text, = 1 foto, 2=video , 3=audio
    
    public id: number = -1;
    public sender: User = null;
    public text: string = "";
    public type: number = 0;
    public received: number = 0;
    public created_at: number;
    public media: any;
    public seek: number = 0;
    public thumbnail: string;
    
    constructor(obj?: any) {
        this.set(obj);
    }
    
    set(obj?: any) {
        if (obj) {
            this.id = (typeof obj.id === "number") ? obj.id : this.id;
            this.sender = obj.sender || this.sender;
            this.text = obj.text || this.text;
            this.type = obj.type || this.type;
            this.media = obj.media || this.media;
            this.received = obj.received || this.received;
            this.created_at = +obj.created_at || +this.created_at;
        }
    }
    
    getDate(){
        let date = new Date(this.created_at);
        return date.getHours() +':'+ date.getMinutes();
//        return new Date(this.created_at).toISOString().slice(-13, -5);
    }
    
}