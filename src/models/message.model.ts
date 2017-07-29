


export class Message {
    
    public id: number = -1;
    public sender: string = "";
    public body: string = "";
    public type: string = "";
    //mettere timestamp
    public created_at: string = "";
    public media: any;
    
    constructor(obj?: any) {
        this.set(obj);
    }
    
    set(obj?: any) {
        if (obj) {
            this.id = (typeof obj.id === "number") ? obj.id : this.id;
            this.sender = obj.sender || this.sender;
            this.body = obj.body || this.body;
            this.type = obj.type || this.type;
            this.created_at = obj.created_at || this.created_at;
        }
    }
    
}