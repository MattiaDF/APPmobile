export class User {

    public id: number = 0;
    public name: string = ''
    public token: string = '';
    public phone: string = '';
    public url_img: string = '';
    public active_push: boolean = true;
    public updated_at: Date;


    constructor(obj?: any) {
        this.setObj(obj);
    }

    setObj(obj?: any) {
        if (obj) {
            this.id = obj.id || this.id;
            this.name = obj.name || this.name;
            this.token = obj.token || this.token;
            this.phone = obj.phone || this.phone;
            this.url_img = obj.url_img || this.url_img;
            this.active_push = obj.active_push || this.active_push;
            this.updated_at = obj.updated_at;
        }
    }

}