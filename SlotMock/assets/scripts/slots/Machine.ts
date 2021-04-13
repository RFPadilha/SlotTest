import Aux from '../SlotEnum';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Machine extends cc.Component {
  @property(cc.Node)
  public button: cc.Node = null;

  @property(cc.Prefab)
  public _reelPrefab = null;

  @property({ type: cc.Prefab })
  get reelPrefab(): cc.Prefab {//function for retrieving tile reels
    return this._reelPrefab;
  }

  set reelPrefab(newPrefab: cc.Prefab) {//creates new and empty reels
    this._reelPrefab = newPrefab;
    this.node.removeAllChildren();

    if (newPrefab !== null) {
      this.createMachine();
    }
  }

  @property({ type: cc.Integer })//self-explanatory
  public _numberOfReels = 3;

  @property({ type: cc.Integer, range: [3, 6], slide: true })//detects number of reels generated
  get numberOfReels(): number {
    return this._numberOfReels;
  }

  set numberOfReels(newNumber: number) {//sets number of generated reels
    this._numberOfReels = newNumber;

    if (this.reelPrefab !== null) {
      this.createMachine();
    }
  }

  public reels = [];//array for the reels

  public spinning = false;//boolean to detect activity on the reel

  private d100;//returns a number between 1 and 100, like a hundred sided dice, used to determine winning chances
  private single;//selects random tile texture when stopping reels
  private double;//potentially selects a different tile texture
  private triple;

  randomizeResult(): void{
    this.d100 = Math.floor(1+ (100* Math.random()));
    this.single = Math.floor(30*Math.random());
    this.double = Math.floor(30*Math.random());
    this.triple = Math.floor(30*Math.random());
    console.log(this.d100);
    
  }

  createMachine(): void {//creating the slot machine
    this.node.destroyAllChildren();//destroy previous machines, if any
    this.reels = [];//array for reel storage and manipulation

    let newReel: cc.Node;//instantiating gameObject:
    for (let i = 0; i < this.numberOfReels; i += 1) {
      newReel = cc.instantiate(this.reelPrefab);//creates new reel from prefab
      this.node.addChild(newReel);//adds the new reel as a child to the game object
      this.reels[i] = newReel;//adds new reel to previously declared array

      const reelScript = newReel.getComponent('Reel');
      reelScript.shuffle();//shuffles reel tiles
      reelScript.reelAnchor.getComponent(cc.Layout).enabled = false;
    }

    this.node.getComponent(cc.Widget).updateAlignment();
  }

  spin(): void {
    this.spinning = true;
    this.button.getChildByName('Label').getComponent(cc.Label).string = 'STOP';

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i].getComponent('Reel');
      theReel.stopAnimations();
      theReel.spinDirection = Aux.Direction.Down;
      theReel.shuffle();//shuffles reel when spinning again

      theReel.doSpin(0.05);//sets spin velocity
    }
    
    this.randomizeResult();//randominzes result for each spin

  }

  lock(): void {//stops button interaction
    this.button.getComponent(cc.Button).interactable = false;
  }

  stop(result: Array<Array<number>> = null): void {//when stopping the reel:
    setTimeout(() => {
      this.spinning = false;
      this.button.getComponent(cc.Button).interactable = true;
      this.button.getChildByName('Label').getComponent(cc.Label).string = 'SPIN';
    }, 2500);//resets spin button

    const rngMod = 1;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = 1;//randomizes reel stop time, removed
      const theReel = this.reels[i].getComponent('Reel');

      //here is where we'll define the chances of victory and randomness
    
      //does nothing if d100 <= 50, tiles will be stopped at random, 50%
      if(this.d100>50 && this.d100<=83){//single line victory, 33%
        theReel.stopOnTiles(1, this.single, this.double, this.triple);//chooses one tile at random to stop on a line
      }else if(this.d100>83 && this.d100<=93){//double line victory, 10%
        theReel.stopOnTiles(2, this.single, this.double, this.triple);
      }else if(this.d100>93){//triple line victory, 7%
        theReel.stopOnTiles(3, this.single, this.double, this.triple);
      }

      setTimeout(() => {
        theReel.readyStop(result[i]);
        
      }, spinDelay * 1000);//stops reels
    }
  }
}
