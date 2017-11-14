import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {EditChatroomPage} from './edit-chatroom';
import {Camera} from '@ionic-native/camera';

@NgModule({
    declarations: [
        EditChatroomPage,
    ],
    imports: [
        IonicPageModule.forChild(EditChatroomPage),
    ],
    exports: [
        EditChatroomPage
    ],
    providers: [
        Camera
    ]
})
export class EditChatroomPageModule {}
