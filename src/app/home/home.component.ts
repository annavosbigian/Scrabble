import { Component } from '@angular/core';
import { Player } from '../../models/player.model';
import { Letter } from '../../models/letter.model';
import { GameService } from '../../services/game.service';
import { Space } from '../../models/space.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { forkJoin, Observable } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  player: Player;
  letter: Letter;
  titleWord: string[] = ["S", "C", "R", "A", "B", "B", "L", "E"];
  start: boolean;
  message: string;
  showStats: boolean = false;
  totalTurns: number = 0;
  averageScore: number;

  //each row of the board
  rowOne: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  rowTwo: number[] = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
  rowThree: number[] = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];
  rowFour: number[] = [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
  rowFive: number[] = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74];
  rowSix: number[] = [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
  rowSeven: number[] = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104];
  rowEight: number[] = [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119];
  rowNine: number[] = [120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134];
  rowTen: number[] = [135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149];
  rowEleven: number[] = [150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164];
  rowTwelve: number[] = [165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179];
  rowThirteen: number[] = [180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194];
  rowFourteen: number[] = [195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209];
  rowFifteen: number[] = [210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224];



  constructor(private gameService: GameService){
    this.gameService.createLetters();
    this.gameService.createBoard();
    this.start = true;
  }

  //creates a new game or restarts current game
  startNewGame(name: string, restart: boolean = false) {
    this.player = this.gameService.startGame(name, restart);
    this.start = false;
    this.titleWord = [...name];
    this.message = "Place your first letter in the middle tile."
  }

  //receives letter from player-letters and removes the last message from screen
  playLetter(letter: Letter){
    //this.gameService.letter = letter;
    this.showStats = false;
    this.letter = letter;
  }
  
  //removes the last played letter
  undoMove(){
    this.gameService.undoPlaceLetter();
  }

  updateMessage(message: string){
    this.message = message;
  }

  //gather the words connected to the played letters and checks the dictonary to see if they're valid
  submitWord() {
    var wordsObservable: Observable<any>[] = [];
    var words: string[] = this.gameService.findAllWords();
    var invalidWords: string[] = [];
    words.forEach(word => {
      wordsObservable.push(this.gameService.getMWDictionary(word));
    });
    const observable = forkJoin(wordsObservable);
    observable.subscribe((response) =>{
      /*for(var r in response){
        console.log("meta is", r[0].meta);
      }*/
      var i: number = 0;
      response.forEach((word) => {
        try{
          if(!word[0].meta || !word[0].meta.id || word[0].meta.id != word[0].meta.id.toLowerCase()){
            invalidWords.push(words[i]);
          }
          i++
        }
        catch(err){
          console.log(err);
        }
      })
      if (invalidWords.length > 0){
        this.undoTurn(invalidWords);
      }
      else {
        this.clearTurn();
      }
      });
    }
      
  
  //clears the turn if an invalid word is played
  undoTurn(invalidWords: string[]){
    this.gameService.undoTurn();
    var message = invalidWords.pop();
    if (invalidWords.length > 0){
      invalidWords.forEach(word =>{
        message += " & " + word;
      })
        message += " are invalid words";
    }
    else {
      message += " is an invalid word";
    }
    this.message = message;
  }

  //clears the turn if all words are valid
  clearTurn(){
    if (this.player.letters.length == 0){
      this.gameService.thisTurnScore += 50;
    }
    this.player.score += this.gameService.thisTurnScore;
    this.gameService.clearTurn();
    this.totalTurns++;
    this.averageScore = Math.round(10 * this.player.score/this.totalTurns)/10;
    this.showStats = true;
    this.message = this.gameService.remainingLetters + " letters remaining";
  }

}
