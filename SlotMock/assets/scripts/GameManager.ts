const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property(cc.Node)//cc for "cocos" element, "Node" is equivalent to unity's gameObject
  machine = null;

  @property({ type: cc.AudioClip })//button click audio
  audioClick = null;


  private block = false;

  private result = null;

  start(): void {//initializes game by creating the machine
    this.machine.getComponent('Machine').createMachine();
  }

  update(): void {
    if (this.block && this.result != null) {//when blocks are stopped and result is available, shows result
      this.informStop();
      this.result = null;
    }//basically detects game ending
  }

  click(): void {
    cc.audioEngine.playEffect(this.audioClick, false);//plays click sound

    if (this.machine.getComponent('Machine').spinning === false) {//if machine is stopped, starts spinning
      this.block = false;
      this.machine.getComponent('Machine').spin();
      this.requestResult();
    } else if (!this.block) {//else stops the machine
      this.block = true;
      this.machine.getComponent('Machine').lock();
    }
  }

  async requestResult(): Promise<void> {//assynchronous result loading
    this.result = null;
    this.result = await this.getAnswer();
  }



  getAnswer(): Promise<Array<Array<number>>> {//randomizes results on each tile
    var slotResult = [];
    
    return new Promise<Array<Array<number>>>(resolve => {
        setTimeout(() => {
          resolve(slotResult);
        }, 1000 + 500 * (Math.random()));
    });
  }


  informStop(): void {//displays result when machine stops
    const resultRelayed = this.result;
    this.machine.getComponent('Machine').stop(resultRelayed);
  }
}
