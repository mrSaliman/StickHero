// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Platform extends cc.Component implements IPoolable {
    
    @property({
        min: 1,
        max: 100,
        step: 1
    })
    private width: number = 1;
    
    public setPosition(pos: cc.Vec3) {
        this.node.position.set(pos);
    }

    public setActive(active: boolean){
        this.node.active = active;
    }

    reset(): void {
        this.node.active = false;
        this.node.position.set(cc.Vec3.ZERO);
    }
}
