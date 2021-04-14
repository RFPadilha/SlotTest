import Aux from '../SlotEnum';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reel extends cc.Component {//defining reel class variables:
  @property({ type: cc.Node })
  public reelAnchor = null;//anchor point for this reel

  @property({ type: cc.Enum(Aux.Direction) })
  public spinDirection = Aux.Direction.Down;//spin direction

  @property({ type: [cc.Node], visible: false })
  public tiles = [];//tile array
  
  @property({ type: cc.Prefab })
  public _tilePrefab = null;//tile prefab

  

  @property({ type: cc.Prefab })
  get tilePrefab(): cc.Prefab {//function to return tile prefab
    return this._tilePrefab;
  }

  set tilePrefab(newPrefab: cc.Prefab) {//applying tile prefabs
    this._tilePrefab = newPrefab;//receives prefab
    this.reelAnchor.removeAllChildren();//remove all children from reel, if any
    this.tiles = [];//declares new tile array

    if (newPrefab !== null) {//if prefab is not null, i.e. exists
      this.createReel();//creates new reel
      this.shuffle();//shuffles tiles
    }
  }

  private result: Array<number> = [];

  public stopSpinning = false;//spin control, public because other scripts must access it

  

  createReel(): void {//creating new reel
    let newTile: cc.Node;//tiles are new game objects
    for (let i = 0; i < 5; i += 1) {
      newTile = cc.instantiate(this.tilePrefab);//instantiates new tiles
      this.reelAnchor.addChild(newTile);//adds to current reel
      this.tiles[i] = newTile;//adds tiles to array
    }
    
  }

  shuffle(): void {//self-explanatory, not random anymore
    for (let i = 0; i < this.tiles.length; i += 1) {
      this.tiles[i].getComponent('Tile').setRandom();
    }
  }

  readyStop(newResult: Array<number>): void {
    const check = (this.spinDirection === Aux.Direction.Down || newResult == null);//only false when reel is not spinning, and result is obtained
    this.result = check ? newResult : newResult.reverse();//if check is false, newResult.reverse(), otherwise newResult
    this.stopSpinning = true;
 
  }//verifies if the reel is working correctly, if so, detects appropriate result and stops spinning

  async stopOnTiles(reels: number, single: number, double: number, triple: number){//function used to force a victory under the right conditions
    
    //depending on the results, stops a set number of lines on the same tile
    this.tiles[1].getComponent('Tile').setTile(single);//one line of equal tiles
    this.tiles[1].getComponent('Tile').anim.play();

    if(reels >1){
      this.tiles[0].getComponent('Tile').setTile(double);//two lines with equal tiles, can be different between lines
      this.tiles[0].getComponent('Tile').anim.play();
    }
    if(reels >2){
      this.tiles[2].getComponent('Tile').setTile(triple);//three lines
      this.tiles[2].getComponent('Tile').anim.play();
    }
    
  }

  public stopAnimations(){//used to stop tile blinking on victory
    for(var i=0; i<3;i++){
      
      this.tiles[i].getComponent('Tile').anim.setCurrentTime(0);
      this.tiles[i].getComponent('Tile').anim.stop();
    }
  }

  changeCallback(element: cc.Node = null): void {
    const el = element;
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;//detects which spinning direction is the reverse one
    if (el.position.y * dirModifier > 288) {
      el.position = cc.v3(0, -288 * dirModifier, 0);//if tile is no longer on screen, returns to first reel position

      let pop = null;
      if (this.result != null && this.result.length > 0) {//if there's a result, returns it on "pop" variable
        pop = this.result.pop();
      }
      
      if (pop != null && pop >= 0) {
        el.getComponent('Tile').setTile(pop);//if "pop" exists and is greater than 0, puts it pack on the reel
      } 
    }
  }

  checkEndCallback(element: cc.Node = null): void {
    const el = element;
    if (this.stopSpinning) {//if reel stopped spinning
      this.getComponent(cc.AudioSource).play();//plays audio file
      this.doStop(el);//stops element
    } else {
      this.doSpinning(el);//otherwise keeps spinning
    }
  }

  doSpin(windUp: number): void {//function to start reel spinning, with windup/delay
    this.stopSpinning = false;
    this.reelAnchor.children.forEach(element => {
      const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

      const delay = cc.tween(element).delay(windUp);
      const start = cc.tween(element).by(0.25, { position: cc.v2(0, 144 * dirModifier) }, { easing: 'backIn' });
      const doChange = cc.tween().call(() => this.changeCallback(element));
      const callSpinning = cc.tween(element).call(() => this.doSpinning(element, 5));

      delay
        .then(start)
        .then(doChange)
        .then(callSpinning)
        .start();
    });//applies spin for each element of the reelAnchor
  }

  doSpinning(element: cc.Node = null, times = 1): void {//keeps reel spinning
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween().by(0.04, { position: cc.v2(0, 144 * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const repeat = cc.tween(element).repeat(times, move.then(doChange));
    const checkEnd = cc.tween().call(() => this.checkEndCallback(element));

    repeat.then(checkEnd).start();
  }

  doStop(element: cc.Node = null): void {//ends spinning with bouce effect
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;//detects reverse spinning direction

    const move = cc.tween(element).by(0.04, { position: cc.v3(0, 144 * dirModifier, 0) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const end = cc.tween().by(0.05, { position: cc.v2(0, 144 * dirModifier) }, { easing: 'bounceOut' });

    

    move
      .then(doChange)
      .then(move)
      .then(doChange)
      .then(end)
      .then(doChange)
      .start();
  }
}
