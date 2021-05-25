import { MAX_POS } from "../constant";
import { getRandomInteger } from "./number";

export function getInitialTileList() {
    const tileList = [];
    const tile1 = makeTile(tileList)
    tileList.push(tile1)
    const tile2 = makeTile(tileList)
    tileList.push(tile2)
    return tileList
}

export function checkCollision(tileList, tile){
  return tileList.some(item => item.x === tile.x && item.y === tile.y)
  // some은 아이템중에 하나라도 만족하면 true를 반환
}

let currentId = 0; 
export function makeTile(tileList) {
    let tile;
    // 현재 들고있는 타일들과 위치가 충돌되면 안되니깐 
    // 만족못하면 계속 만드는 것으로 
    while(!tile || checkCollision(tileList, tile)) {
        tile ={
          id: currentId++,
          x: getRandomInteger(1, MAX_POS),
          y: getRandomInteger(1, MAX_POS),
          value : 2
        }
    }
  return tile
}