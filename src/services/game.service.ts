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
  player: Player;
  words: string[];
  message: string;
  dictionaryUrl = '../assets/dictionary.json';
  MWDictionaryUrl =  'https://dictionaryapi.com/api/v3/references/collegiate/json/'
  key='?key=d9bbe7bd-eb21-4cfb-b08b-81bb630087aa'
  remainingLetters: number = 98;

  constructor(private http: HttpClient){

  }

  //initializes the board, including bonus spaces
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

  //initializes all letters
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

  //gives the player letters, begins game and clears previous game if restarting 
  public startGame(name: string = "", restart: boolean){
    if (restart){
      this.createBoard();
      this.player ={name: this.player.name, score: 0, letters: []};
    }
    else{
      this.player = {name: name, score: 0, letters: []};
    }
    this.getLetters(7);
    this.thisTurnSpaces = [];
    this.tempAvailable = [];
    this.thisTurnScore = 0;
    this.direction = null;
    this.spaces[112].available = true;
    return this.player;
  }

  //replenishes the player's letters
  public getLetters(total: number) {
    //gather random letters
    for (let i = 0; i < total; i++) {
      var letterLocation = Math.floor(Math.random() * this.remainingLetters);
      this.player.letters.push(this.letters[letterLocation]);
      this.letters.splice(letterLocation, 1);
      this.remainingLetters--;
    }
  }
 
  //when player drops letter, checks that it's a valid move, then adds to array
  playLetter(spaceId: number, letter: Letter){
    this.message="";
    //initiate letters
    //initiate word if empty
    if (this.thisTurnSpaces.length < 1){
      this.start = spaceId;
      this.setLetter(spaceId, letter)
    }
    //validate the move
    else if (this.validateMove(spaceId)){
      this.setLetter(spaceId, letter)
    }
    return this.message;
  }

  //adds letter to the board and make neighboring spaces available
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
  
  //checks that the played letter is connected with the current word
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

 //checks that the letter played is in the same direction as other letters from turn 
  scanDirection(spaceId: number, distance: number){
    var min: number = spaceId < this.thisTurnSpaces[0] ? spaceId : this.thisTurnSpaces[0];
    var max: number = spaceId > this.thisTurnSpaces[0] ? spaceId : this.thisTurnSpaces[0];
    max -= distance;
    while (max > min){
      if (!this.spaces[max].occupied){
        this.message = "Continue building off of this turn's word";
        return false;
      }
      max -= distance;
    }

    return true;
  }

  //opens the unoccupied spaces next to the played letter
  makeNeighborsAvailable(spaceId: number){
    //if not already available, add to avail array
    for (let neighbor of this.spaces[spaceId].neighbors){
      if (!this.spaces[neighbor].occupied && !this.spaces[neighbor].available){
        this.tempAvailable.push(neighbor);
        this.spaces[neighbor].available = true;
      }
    }
  }

  //gives player their last played letter and undoes all associated actions
  undoPlaceLetter(){
    var lastSpace: number = this.thisTurnSpaces.pop();
    var lastLetter: Letter = this.spaces[lastSpace].letter;
    this.player.letters.push(lastLetter);
    if (this.player.letters.length >= 6){
      this.direction = "";
    }
    this.reopenSpace(lastSpace);
  }

  //makes the newly opened spaces unavailable
  reopenSpace(lastSpace: number){
    this.spaces[lastSpace].letter = null;
    this.spaces[lastSpace].occupied = false;
    var space;
    while (space != lastSpace){
      space = this.tempAvailable.pop();
      this.spaces[space].available = !this.spaces[space].available;
    }
  }

    //scans all played letters for connected words
  findAllWords(): string[]{
    this.thisTurnScore = 0;
    this.words = [];
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
     return this.words;
  }

  //finds the word connected to the space
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

  //calculates the word's score with all bonuses
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

    //calls the Merriam Webster dictionary api
  public getMWDictionary(word: string): Observable<any>{
    return this.http.get(this.MWDictionaryUrl + word + this.key);
  }

  //removes the turn from the board if one or more words were invalid
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

  //clears turn if all words were valid
  clearTurn(){
    this.thisTurnSpaces.forEach(space => {
      this.spaces[space].bonus = "";
    });
    this.thisTurnSpaces = [];
    this.tempAvailable = [];
    this.direction = null;
    if (this.letters.length > 7 - this.player.letters.length){
      this.getLetters(7 - this.player.letters.length);
    }
    else if (this.letters.length > 0) {
      this.getLetters(this.letters.length);
    }
    else if (this.player.letters.length == 0){
      this.endGame();
        }
  }

  //When the player has played the final letter, show Contratulations on the board
  endGame(){
    this.startGame(this.player.name, true);
    for (var i = 105; i < 120; i++){
      this.spaces[i].occupied=true;
      this.spaces[i].bonus="tws";
    }
    this.spaces[105].letter = {letter: 'c', points: 3};
    this.spaces[106].letter = {letter: 'o', points: 1};
    this.spaces[107].letter = {letter: 'n', points: 1};
    this.spaces[108].letter = {letter: 'g', points: 2};
    this.spaces[109].letter = {letter: 'r', points: 1};
    this.spaces[110].letter = {letter: 'a', points: 1};
    this.spaces[111].letter = {letter: 't', points: 1};
    this.spaces[112].letter = {letter: 'u', points: 1};
    this.spaces[113].letter = {letter: 'l', points: 1};
    this.spaces[114].letter = {letter: 'a', points: 1};
    this.spaces[115].letter = {letter: 't', points: 1};
    this.spaces[116].letter = {letter: 'i', points: 1};
    this.spaces[117].letter = {letter: 'o', points: 1};
    this.spaces[118].letter = {letter: 'n', points: 1};
    this.spaces[119].letter = {letter: 's', points: 1};
  }

//local dictionary
  /*private dictionaryUrl = '../assets/test.json';

  public getDictionary(): Observable<any> {
    return this.http.get(this.dictionaryUrl);
  }*/


  //submits turn for validation and score
  /*submitWord(){
    if (this.player.letters.length == 0){
      this.thisTurnScore += 50;
    }
    this.findAllWords();
    this.checkValidWords();
    return this.message;
   }

   checkValidWords() { 
    var invalidWords: string[] = [];
    this.getDictionary().subscribe(data => {
      this.words.forEach(word =>{
        var firstLetter = word.charAt(0);
        var definition = data[firstLetter][word];
        if (!definition){
          invalidWords.push(word);
        }

      })
      if (invalidWords.length > 0){
       this.undoTurn();
      }
      else {
        this.player.score += this.thisTurnScore;
        this.clearTurn();
      }
    });
  }
  

  isValidWord(word: string){
    this.getDictionary().subscribe(data => {
      var firstLetter = word.charAt(0);
      var definition = data[firstLetter][word];
      if (definition){
        return true;
      }
      else {
        return false;
      }
    });
  }
*/


}
