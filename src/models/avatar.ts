export class Avatar {

    public small: string = '';
    public src: string = ''
    public url_img : string = '';


    constructor(smallUrl, src, url_img?: string) {
        this.small = smallUrl;
        this.src = src;
        if (url_img){
            this.url_img = url_img;
        }
    }


}