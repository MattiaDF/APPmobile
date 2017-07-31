import {Component, Input} from '@angular/core';
import {Voice} from '../../models/voice.model';
//Providers
import {AudioProvider} from '../../providers/audio/audio';

/**
 * Generated class for the AudiocomponentComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'audiocomponent',
    templateUrl: 'audiocomponent.html'
})
export class AudiocomponentComponent {

    public voice: Voice;
    constructor(private sAudio: AudioProvider) {
        console.log('Hello AudiocomponentComponent Component');
    }

    play() {
        console.log(this.voice);
        if (this.voice.audio == null) {
            this.voice.audio = this.sAudio.getFile(this.voice.nameFile);
        }
        this.voice.audio.play();

    }

    @Input()
    set _voice(voice: Voice) {
        // Here you can do what you want with the variable
        this.voice = voice;
    }

}
