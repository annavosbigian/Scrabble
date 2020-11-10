import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Letter } from '../../models/letter.model';
import { GameService } from 'src/services/game.service';
import { GamePlayService } from 'src/services/game-play.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() letter: Letter;
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
  //rows: string[] = ['rowOne', 'rowTwo', 'rowThree', 'rowFour', 'rowFive', 'rowSix'];
  rows: Object = { 'rowOne': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
            'rowTwo':[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            'rowThree': [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]}
  @Output() messageEvent = new EventEmitter<string>();
  lettersMustTouchMessage: string = "New letters must be attached to letters on the board.";


  constructor(public gameService: GameService, public gamePlayService: GamePlayService) { }

  ngOnInit() {
  }

  seeId(id){
    console.log(this.gameService.spaces[id]);
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(id) {
    //ev.preventDefault();
    //var data = ev.dataTransfer.getData("text");
    //if board at target id is not occuppied && available, set element
    //console.log("space occupation : " + this.gameService.spaces[ev.target.id].occupied);
    console.log("space availability : " );
    
    if (!this.gameService.spaces[id].occupied && this.gameService.spaces[id].available) {
      //ev.target.appendChild(document.getElementById(data));
      var message = this.gameService.playLetter(id, this.letter);
      this.messageEvent.emit(message);
    }
    else {
      //toastr must play in an open space connected to a played letter
      if (this.gameService.spaces[112].occupied){
        this.messageEvent.emit(this.lettersMustTouchMessage);
      }
    }
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

}
