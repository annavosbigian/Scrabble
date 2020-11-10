import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Letter } from '../../models/letter.model';
import { Player } from 'src/models/player.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-player-letters',
  templateUrl: './player-letters.component.html',
  styleUrls: ['./player-letters.component.css']
})
export class PlayerLettersComponent implements OnInit {
  //@Output() letter: Letter;
  @Output() letterEvent = new EventEmitter<Letter>();
  @Input() player: Player;
  currentId: number;

  constructor() { }

  ngOnInit() {
  }

  
  playLetter(letter: Letter) {
    this.letterEvent.emit(letter);
  }

  drag(id, letter: Letter) {
    console.log("dragging!", id);
    this.currentId = id;
    this.playLetter(letter);
    //ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    //ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //console.log("current id is " + this.currentId);
    //console.log("target is " + ev.target.id);
    if (ev.target.id){
      moveItemInArray(this.player.letters, this.currentId, ev.target.id);
    }
    else {
      this.playLetter(this.player.letters[ev.currentIndex]);
    }
  }

  allowDrop(ev) {
    ev.preventDefault();
  }
}
