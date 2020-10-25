import { Component } from '@angular/core';
import { Player } from '../../models/player.model';
import { GamePlayService } from '../../services/game-play.service';
import { Letter } from '../../models/letter.model';
import { GameService } from '../../services/game.service';
import { Space } from '../../models/space.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';



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


  playLetter(letter: Letter){
    //this.gameService.letter = letter;
    this.showStats = false;
    this.letter = letter;
  }

  constructor(private gameService: GameService, private gamePlayService: GamePlayService) {
    this.gameService.createLetters();
    this.gameService.createBoard();
    this.start = true;
    //this.gameService.board = Space[15][15];
  }

  startNewGame(name: string, restart: boolean = false) {
    this.player = this.gameService.startGame(name, restart);
    this.start = false;
    this.titleWord = [...name];
    this.message = "Place your first letter in the middle tile."
    //this.gameService.player; 
  }

  undoMove(){
    this.gameService.undoPlaceLetter();
  }

  updateMessage(message: string){
    this.message = message;
    console.log(message);
  }

  //change it to an array of the locations that need to be filled in with letters


  /*
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.player.letters, event.previousIndex, event.currentIndex);
  }
  */


  //for local dictionary
  /*submitWord() {
    this.gameService.submitWord();
    var invalidWords: string[] = [];
    this.gameService.getDictionary().subscribe((data) => {
      this.gameService.words.forEach(word =>{
        var firstLetter = word.charAt(0);
        var definition = data[firstLetter][word];
        if (!definition){
          invalidWords.push(word);
        }

      })
      if (invalidWords.length > 0){
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
      else {
        this.totalTurns++;
        this.averageScore = Math.round(10 * this.player.score/this.totalTurns)/10;
        this.showStats = true;
        this.message = this.gameService.remainingLetters + " letters remaining";
      }
    //add letters for player
  });

  }
*/


  submitWord() {
    //figure out how to check attached letters and also letters above and below
    var words: string[] = this.gameService.findAllWords();
    console.log(words);
    var invalidWords: string[] = [];
    words.forEach(word => {
      this.gameService.getMWDictionary(word).subscribe((response) =>{
        console.log("word is ", word);
        console.log("words length is", words.length);
        console.log("response", response);
        if (response[0].meta && response[0].meta.id && word.substring(0, 1) == response[0].meta.id.substring(0, 1)){
          console.log("valid", response[0].meta.id);
        }
        else {
          console.log("invalid", word);
          invalidWords.push(word);
        }

        if (word == words[words.length - 1]){
          if (invalidWords.length > 0){
            this.undoTurn(invalidWords);
          }
          else {
            this.clearTurn();
          }
        }
      })
    });
  }


  undoTurn(invalidWords: string[]){
    console.log("undoing turn");
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

  clearTurn(){
    console.log("clearing turn");
    this.player.score += this.gameService.thisTurnScore;
    this.gameService.clearTurn();
    this.totalTurns++;
    this.averageScore = Math.round(10 * this.player.score/this.totalTurns)/10;
    this.showStats = true;
    this.message = this.gameService.remainingLetters + " letters remaining";
  }

  /*allowDrop(ev) {
    ev.preventDefault();
  }

drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log(data);
  console.log("target is " + ev.target.id);
  if (ev.target.id > 2) {
    ev.target.appendChild(document.getElementById(data));

  }
}*/

    /*this.gameService.getDictionary().subscribe((data) => {
      this.gameService.words.forEach(word =>{
        var firstLetter = word.charAt(0);
        var definition = data[firstLetter][word];
        if (!definition){
          invalidWords.push(word);
        }

      })
      if (invalidWords.length > 0){
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
      else {
        this.totalTurns++;
        this.averageScore = Math.round(10 * this.player.score/this.totalTurns)/10;
        this.showStats = true;
        this.message = this.gameService.remainingLetters + " letters remaining";
      }
    //add letters for player
  });*/
}
