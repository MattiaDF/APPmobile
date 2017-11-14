import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';


// my providers
import {UserProvider} from '../../providers/user/user'
import {ContactProvider} from '../../providers/contact/contact'
import {MediaProvider} from '../../providers/media/media'


//my models
import {User} from '../../models/user';
/**
 * Generated class for the ImpUtentePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-imp-utente',
    templateUrl: 'imp-utente.html',
})
export class ImpUtentePage {

    public user: User;
    public image_url;
    public name;
    public editable: boolean = false;

    constructor(public navCtrl: NavController,
        public navParams: NavParams, public alertCtrl: AlertController,
        public sUser: UserProvider,
        public sMedia: MediaProvider,
        public sConltact: ContactProvider,
        private camera: Camera) {

        let user = this.sUser.get();
        
        this.user = this.sConltact.getUser(user.id);
        this.name = this.user.name;
        this.image_url = this.user.avatar.src;
    }

    save() {
        this.user.updated_at = new Date();
        this.user.name = this.name;
        console.log(new Date())
        console.log('nome modificato', this.user.name, 'immagine caricata', this.image_url)
        this.sMedia.uploadImageUser(this.image_url, this.user).then(() => {
            console.log(this.user, 'asdsadsadsdasdsadsadsad')
            let user = this.sUser.get();
            user.name = this.name;
            this.sUser.save(user).then(() => {
                this.sConltact.updateSingleContact(this.user);
                this.editable = false;
            })
            console.log("transfert success");
        }).catch((err) => {
            console.log("transfert fail", err);
        })
    }

    uploadPhoto() {
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: this.camera.EncodingType.PNG,
            mediaType: this.camera.MediaType.PICTURE,
            //            saveToPhotoAlbum: true,
            correctOrientation: true,
            allowEdit: true,
        }

        this.camera.getPicture(options).then((imageData) => {

            console.log(imageData, 'imageDAta');
            this.image_url = imageData;
        }, (err) => {
            // Handle error
        });


    }

    annulla() {
        this.editable = false;
        this.name = this.user.name;
        this.image_url = this.user.avatar.src;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ImpUtentePage');
    }
}
