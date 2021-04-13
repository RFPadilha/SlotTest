const { ccclass, property } = cc._decorator;
//definition of what a game tile is

@ccclass
export default class Tile extends cc.Component {
  @property({ type: [cc.SpriteFrame], visible: true })//defines sprite and visibility
  public textures = [];//array of textures for tiles

  @property({type: [cc.Animation]})
  public anim;

  
  
  async onLoad(): Promise<void> {//assyncronous loading of textures
    this.anim = this.getComponentInChildren(cc.Animation);
    await this.loadTextures();
  }

  async resetInEditor(): Promise<void> {//sets random textures on tiles
    await this.loadTextures();
    //this.setRandom();
  }

  async loadTextures(): Promise<boolean> {//loads textures, returns boolean when done
    const self = this;
    return new Promise<boolean>(resolve => {//tells where textures are, loads all of them and defines callbacks
      cc.loader.loadResDir('gfx/Square', cc.SpriteFrame, function afterLoad(err, loadedTextures) {
        self.textures = loadedTextures;
        resolve(true);
      });
    });
  }

  public setTile(index: number): void {//assigns texture to tile
    this.node.getComponent(cc.Sprite).spriteFrame = this.textures[index];//assigns "index" texture
    
  }

  setRandom(): void {//tile randomizer
    const randomIndex = Math.floor(Math.random() * this.textures.length);
    this.setTile(randomIndex);//assigns random texture
  }



  
}
