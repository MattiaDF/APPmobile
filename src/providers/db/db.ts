import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {SQLite, SQLiteObject} from '@ionic-native/sqlite';

/*
  Generated class for the DbProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbProvider {
    
    private db: SQLiteObject;

    constructor(private sqlite: SQLite) {
        console.log('Hello DbProvider Provider');
        this._init();
            
        
    }

    _init() {
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                this.db = db;
                db.executeSql('create table IF NOT EXISTS user(id INTEGER(10), name VARCHAR(32), token VARCHAR(64), phone VARCHAR(10), url_img VARCHAR(100), active_push INTEGER(1), updated_at TEXT, image BLOB)', {})
                    .then(() => console.log('Executed SQL'))
                    .catch(e => console.log(e));
                    
                db.executeSql('create table IF NOT EXISTS chatroom(id INTEGER(10), name VARCHAR(32), token VARCHAR(64), created_at TEXT, url_img VARCHAR(100), user_id INTEGER(10), updated_at TEXT, type INTEGER(1))', {})
                    .then(() => console.log('Executed SQL'))
                    .catch(e => console.log(e));  
                    
                db.executeSql('create table IF NOT EXISTS partecipant(user_id INTEGER(10), chatroom_id INTEGER(10))', {})
                    .then(() => console.log('Executed SQL'))
                    .catch(e => console.log(e));  
                    
                db.executeSql('create table IF NOT EXISTS message(id INTEGER(10), type INTEGER(1), text TEXT, created_at TEXT, chatroom_id INTEGER(10), sender_id INTEGER(10), media_url VARCHAR(100))', {})
                    .then(() => console.log('Executed SQL'))
                    .catch(e => console.log(e));        
            })
            .catch(e => console.log(e));
    }

    query(query: string) {
        return this.db.executeSql(query,[])
            .then(data => {
          return data;
        }, err => {
          console.log('Error: ', err);
          return err;
        });
    }
    
// public add() {
//        this.db.executeSql("INSERT INTO partecipant (user_id, chatroom_id) VALUES ('123', '321')", [])
//            .then(() => console.log('Executed SQL'))
//                    .catch(e => console.log(e)); 
//    }

}
