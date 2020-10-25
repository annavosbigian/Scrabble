import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Letter } from '../../models/letter.model';
import { Player } from 'src/models/player.model';

@Component({
  selector: 'app-player-letters',
  templateUrl: './player-letters.component.html',
  styleUrls: ['./player-letters.component.css']
})
export class PlayerLettersComponent implements OnInit {
  //@Output() letter: Letter;
  @Output() letterEvent = new EventEmitter<Letter>();
  @Input() player: Player;

  playLetter(letter: Letter) {
    this.letterEvent.emit(letter);
  }
  constructor() { }

  ngOnInit() {
  }

  drag(ev, letter: Letter) {
    this.playLetter(letter);
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log("data is " + data);
    console.log("target is " + ev.target.id);
    //if (ev.target.id > 2) {
      ev.target.appendChild(document.getElementById(data));

    //}
  }

  allowDrop(ev) {
    ev.preventDefault();
  }
}
