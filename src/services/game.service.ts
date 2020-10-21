import { Injectable } from '@angular/core';
import { Space } from '../models/space.model';
import { Letter } from '../models/letter.model';
import { Player } from 'src/models/player.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { style } from '@angular/animations';
import { $ } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  spaces: Space[];
  letters: Letter[];
  thisTurnSpaces: number[];
  thisTurnScore: number;
  tempAvailable: number[];
  direction: string;
  start: number;
  //option to only let them choose from tempAvail places
  player: Player;
  words: string[];
  message: string;
  dictionaryUrl = '../assets/dictionary.json';

//don't do available until after - let them put it anywhere and if it isn't touching an available space then it isn't valid

  constructor(private http: HttpClient){

  }

  public createBoard() {
    this.spaces = [];
    var dls: number[] = [3, 11, 36, 38, 45, 52, 59, 92, 96, 98, 102, 108];
    var tls: number[] = [20, 24, 76, 80, 84, 88];
    var dws: number[] = [16, 28, 32, 42, 48, 56, 64, 70, 112];
    var tws: number[] = [0, 7, 14, 105];

    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 15; x++) {
        var location = y * 15 + x;
        var neighborArray: number[] = [];
        if (x % 15 != 0) {
          neighborArray.push(location - 1);
        }
        if (x % 15 != 14) {
          neighborArray.push(location + 1);
        }
        if (y != 0) {
          neighborArray.push(location - 15);
        }
        if (y != 14) {
          neighborArray.push(location + 15);
        }
        //this.board[i][j] = false;
        this.spaces[location] = {
          xcoord: x,
          ycoord: y,
          letter: null,
          occupied: false,
          available: false,
          neighbors: neighborArray,
          bonus: "",
          css: "empty"
        };
      }
    }

    for (var position of dls) {
      this.spaces[position].bonus = "dls";
      this.spaces[224 - position].bonus = "dls";
      // 116, 123, 131, 137, 141, 143, 147, 180, 187, 194
    }


    for (var pos of dws) {
      this.spaces[pos].bonus = "dws";
      this.spaces[224 - pos].bonus = "dws";
    }


    for (var pos of tls) {
      this.spaces[pos].bonus = "tls";
      this.spaces[224 - pos].bonus = "tls";
    }


    for (var pos of tws) {
      this.spaces[pos].bonus = "tws";
      this.spaces[224 - pos].bonus = "tws";
    }


  }

  public createLetters() {
    this.letters = [];
    for (let i = 0; i < 9; i++) {
      this.letters.push({ letter: "a", points: 1 });
    }
    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "b", points: 3 });
    }
    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "c", points: 3 });
    }
    for (let i = 0; i < 4; i++) {
      this.letters.push({ letter: "d", points: 2 });
    }
    for (let i = 0; i < 12; i++) {
      this.letters.push({ letter: "e", points: 1 });
    }
    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "f", points: 4 });
    }
    for (let i = 0; i < 3; i++) {
      this.letters.push({ letter: "g", points: 2 });
    }
    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "h", points: 4 });
    }
    for (let i = 0; i < 9; i++) {
      this.letters.push({ letter: "i", points: 1 });
    }
    this.letters.push({ letter: "j", points: 8 });

    this.letters.push({ letter: "k", points: 5 });

    for (let i = 0; i < 4; i++) {
      this.letters.push({ letter: "l", points: 1 });
    }
    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "m", points: 3 });
    }
    for (let i = 0; i < 6; i++) {
      this.letters.push({ letter: "n", points: 1 });
    }
    for (let i = 0; i < 8; i++) {
      this.letters.push({ letter: "o", points: 1 });
    }
    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "p", points: 3 });
    }
    this.letters.push({ letter: "q", points: 10 });

    for (let i = 0; i < 6; i++) {
      this.letters.push({ letter: "r", points: 1 });
    }
    for (let i = 0; i < 4; i++) {
      this.letters.push({ letter: "s", points: 1 });
    }
    for (let i = 0; i < 6; i++) {
      this.letters.push({ letter: "t", points: 1 });
    }
    for (let i = 0; i < 4; i++) {
      this.letters.push({ letter: "u", points: 1 });
    }
    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "v", points: 4 });
    }
    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "w", points: 3 });
    }
    this.letters.push({ letter: "x", points: 8 });

    for (let i = 0; i < 2; i++) {
      this.letters.push({ letter: "y", points: 4 });
    }
    this.letters.push({ letter: "z", points: 10 });
  }

  public createPlayer(){

  }

  public startGame(name: string = "", restart: boolean){
    if (restart){
      this.createBoard();
      this.direction = null;
      this.thisTurnSpaces = [];
      this.thisTurnScore = 0;
      this.player ={name: this.player.name, score: 0, letters: []};
    }
    else{
      this.player = {name: name, score: 0, letters: []};
    }
    this.getLetters(7);
    this.spaces[112].available = true;
    return this.player;
  }

  public getLetters(total: number) {
    //gather random letters
    for (let i = 0; i < total; i++) {
      this.player.letters.push(this.letters[Math.floor(Math.random() * 98)]);
    }
  }

  replaceLetters(){
    this.player.letters = [];
    this.getLetters(7);
  }
  
  playLetter(spaceId: number, letter: Letter){
    this.message="";
    //initiate letters
    if (!this.thisTurnSpaces){
      this.thisTurnSpaces = [];
    }
    //initiate word if empty
    if (this.thisTurnSpaces.length < 1){
      this.tempAvailable = [];
      this.start = spaceId;
      this.setLetter(spaceId, letter)
    }
    //validate the move
    else if (this.validateMove(spaceId)){
      this.setLetter(spaceId, letter)
    }
    return this.message;
  }

  setLetter(spaceId: number, letter: Letter){
    var currentSpace: Space = this.spaces[spaceId];
    //set the letter
    currentSpace.letter = letter;
    currentSpace.occupied = true;
    currentSpace.available = false;
    this.tempAvailable.push(spaceId);
    //manage the letters
    this.player.letters.splice(this.player.letters.indexOf(letter), 1);
    this.thisTurnSpaces.push(spaceId);
    this.makeNeighborsAvailable(spaceId);
  }

  //check to make sure the letter is connected to the letters already put down
  //could just do addition down the line - make one the min and one the max - and make sure everything is avail
  validateMove(spaceId: number): boolean {
    var space: Space = this.spaces[spaceId];
    if (!this.direction){
      if (this.spaces[this.start].xcoord == space.xcoord){
        this.direction = "vertical";
      }
      else if (this.spaces[this.start].ycoord == space.ycoord){
        this.direction = "horizontal";
      }
      else {
        this.message = "Letter must join with the " + this.spaces[this.start].letter.letter + " you put down";
        return false;
      }
    }
    return this.checkLettersAreLinked(spaceId);
  }

  checkLettersAreLinked(spaceId: number){
    var currentSpace: Space = this.spaces[spaceId];
    var startSpace: Space = this.spaces[this.start];
    if (this.direction){
      if (this.direction == "vertical" && currentSpace.xcoord == startSpace.xcoord){
        return this.scanDirection(spaceId, 15)
      }
      else if (this.direction == "horizontal" && currentSpace.ycoord == startSpace.ycoord){
        return this.scanDirection(spaceId, 1);
      }
      this.message = "Continue building " + this.direction + "y";
    }
  }

  scanDirection(spaceId: number, distance: number){
    var min: number = spaceId < this.start ? spaceId : this.start;
    var max: number = spaceId > this.start ? spaceId : this.start;
    max -= distance;
    while (max > min){
      if (!this.spaces[max].occupied){
        this.message = "Continue building off of this turn's word";
        return false;
      }
      max -= distance;
    }
    this.start = min;
    return true;
  }

  /*findDirection(spaceId: number){
    if (spaceId == 112){
      return;
    }
    var horizontal: boolean = false;
    var vertical: boolean = false;
    //first letter put down is the start
    if (spaceId - 15 > 0 && this.spaces[spaceId - 15 ].occupied){
      vertical = true;
    }
    else if (spaceId + 15 < this.spaces.length && this.spaces[spaceId + 15 ].occupied){
      vertical = true;
    }
    if (spaceId - 1 > 0 && this.spaces[spaceId - 1 ].occupied){
      horizontal = true;
    }
    else if (spaceId + 1 < this.spaces.length && this.spaces[spaceId + 1 ].occupied){
      horizontal = true;
    }
    if (horizontal && vertical){
      return;
    }
    if (horizontal){
      this.direction = "horizontal";
      return;
    }
    this.direction = "vertical";
  }

  //return letters
*/


  makeNeighborsAvailable(spaceId: number){
    //if not already available, add to avail array
    for (let neighbor of this.spaces[spaceId].neighbors){
      if (!this.spaces[neighbor].occupied && !this.spaces[neighbor].available){
        this.tempAvailable.push(neighbor);
        this.spaces[neighbor].available = true;
      }
    }
  }

  undoPlaceLetter(){
    var lastSpace: number = this.thisTurnSpaces.pop();
    var lastLetter: Letter = this.spaces[lastSpace].letter;
    this.player.letters.push(lastLetter);
    if (this.player.letters.length >=6){
      this.direction = null;
    }
    this.reopenSpace(lastSpace);
  }

  reopenSpace(lastSpace: number){
    this.spaces[lastSpace].letter = null;
    this.spaces[lastSpace].occupied = false;
    var space;
    while (space != lastSpace){
      space = this.tempAvailable.pop();
      this.spaces[space].available = !this.spaces[space].available;
    }
  }

  submitWord(){
    this.thisTurnScore = 0;
    this.words = [];
    this.findAllWords();
    var nonWords: string[] = [];
    this.checkValidWords();
    return this.message;
 /*   if (this.invalidWords.length > 0){
      console.log("invalid", this.invalidWords);
      this.undoTurn();
      return;
    }
    /*this.words.forEach(word => {
      if (this.isValidWord(word)){
        console.log("score is " + this.thisTurnScore);
      }
      else {
        nonWords.push(word);
      }
    })*/
    /*else {
      this.player.score += this.thisTurnScore;
      this.clearTurn();
    }*/
    //this.findTrueStart();
    //if it's a valid word
    //calculate score
    //make this.direction null
    //add new letters
    
  }

  findAllWords(){
    if (this.direction == "vertical"){
      //check each letter for a horizontal word
      this.thisTurnSpaces.forEach(letter => {
        this.checkWord(letter, 1);
      });
      this.checkWord(this.start, 15); 
    }
    else if (this.direction == "horizontal"){
      //check each letter for a vertical word
      this.thisTurnSpaces.forEach(letter => {
        this.checkWord(letter, 15);
      });
      this.checkWord(this.start, 1); 
    }
     else{
       //only put down one letter
       this.checkWord(this.start, 1); 
       this.checkWord(this.start, 15); 
     }
  }

  checkWord(spaceId: number, distance: number){
    var min: number = spaceId;
    var max: number = spaceId;
    while (min - distance >= 0 && this.spaces[min - distance].occupied){
        min -= distance;
    }
    while (max - - distance < this.spaces.length && this.spaces[max - - distance].occupied){
      max = max - - distance;
    }
    if (min < max){
      this.words.push(this.addWordAndScore(min, max, distance));
    }
  }

  addWordAndScore(min: number, max: number, distance: number): string{
    var wordScore: number = 0;
    var word: string = "";
    var bonus = 1;
    while (min <= max){
      word += this.spaces[min].letter.letter;
      wordScore += this.spaces[min].letter.points;
      if (this.spaces[min].bonus){
        if (this.spaces[min].bonus == "dls"){
          wordScore += this.spaces[min].letter.points;
        }
        else if (this.spaces[min].bonus == "tls"){
          wordScore += (this.spaces[min].letter.points * 2);
        }
        else if (this.spaces[min].bonus == "dws"){
          bonus = 2;
        }
        else if (this.spaces[min].bonus == "tws"){
          bonus = 3;
        }
      }
      min = min - - distance;
    }
    wordScore *= bonus;
    this.thisTurnScore += wordScore;
    return word;
  }



  //private dictionaryUrl = '../assets/test.json';

  public getDictionary(): Observable<any> {
    return this.http.get(this.dictionaryUrl);
  }



  checkValidWords() { 
    var invalidWords: string[] = [];
    this.getDictionary().subscribe(data => {
      this.words.forEach(word =>{
        console.log(word);
        var firstLetter = word.charAt(0);
        console.log(firstLetter);
        var definition = data[firstLetter][word];
        console.log(definition);
        if (!definition){
          invalidWords.push(word);
        }

      })
      if (invalidWords.length > 0){
       /* var message = "";
        invalidWords.forEach(word =>{
          message += word + " "
        })
        if (invalidWords.length > 1){
          message += " are invalid words";
        }
        else {
          " is an invalid word";
        }
        this.message = message;*/
        this.undoTurn();
      }
      else {
        this.player.score += this.thisTurnScore;
        this.clearTurn();
      }
    });
  }
  
  undoTurn(){
    this.tempAvailable.forEach(space => {
      this.spaces[space].available = !this.spaces[space].available;
    });
    this.thisTurnSpaces.forEach(space => {
      this.player.letters.push(this.spaces[space].letter);
      this.spaces[space].occupied = false;
      this.spaces[space].letter = null;
    });
    this.tempAvailable = [];
    this.thisTurnSpaces = [];
    this.direction = null;
  }

  isValidWord(word: string){
    console.log(word);
    this.getDictionary().subscribe(data => {
      var firstLetter = word.charAt(0);
      var definition = data[firstLetter][word];
      console.log(definition);
      if (definition){
        return true;
      }
      else {
        return false;
      }
    });
  }

  /*findTrueStart(){
    if (this.direction  == "vertical"){
      while (this.start > 14 && this.spaces[this.start-15].occupied){
        this.start -= 15;
      }
    }
    else{
      while (this.start > 0 && this.spaces[this.start-1].occupied){
        this.start--;
      }
    }
  }*/

  clearTurn(){
    this.thisTurnSpaces.forEach(space => {
      this.spaces[space].bonus = "";
      console.log(this.spaces[space]);
    });
    this.thisTurnSpaces = [];
    this.tempAvailable = [];
    this.direction = null;
    this.getLetters(7 - this.player.letters.length);
  }




}
