import { Injectable } from '@angular/core';
import { Space } from '../models/space.model';
import { Letter } from '../models/letter.model';

@Injectable({
  providedIn: 'root'
})
export class GamePlayService {



  submitWord(){

  }

  public checkWord(word: string) {
    //check whether word is in the dictionary
  }

}
