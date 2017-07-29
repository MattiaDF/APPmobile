import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {MediaPlugin, MediaObject} from '@ionic-native/media';
import {File} from '@ionic-native/file';

/*
  Generated class for the AudioProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AudioProvider {
    audio: MediaObject = null;
    private path: string = "file:///storage/emulated/0/QuickChat/";

    constructor(public http: Http, private media: MediaPlugin,
        private file: File) {
        console.log('Hello AudioProvider Provider');
    }

    recordigStart(name: string) {
        console.log("recording start provider");
        this.audio = this.media.create(this.path + name);
        this.audio.startRecord();
    }

    recordigEnd() {
        console.log("recording end provider");
        this.audio.stopRecord();
        return this.audio.getDuration();
    }

    getFile(name: string): MediaObject {
        return this.media.create(this.path + name);
    }

}
