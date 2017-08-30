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
    


}
