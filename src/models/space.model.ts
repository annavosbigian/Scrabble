import { Letter } from "./letter.model";

export class Space {
  xcoord: number;
  ycoord: number;
  letter: Letter;
  occupied: boolean;
  available: boolean;
  neighbors: number[];
  bonus: string;
  css: string;
}
