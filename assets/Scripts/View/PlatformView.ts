const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformView extends cc.Component {
    

    private base: Platform | undefined;

    init(base: Platform){
        this.base = base;
        this.base.onDataChanged(() => this.onOriginDataChanged());
        this.onOriginDataChanged();
    }

    onOriginDataChanged(){
        if (this.base === undefined){
            throw new Error("base is not defined");
        }
        this.node.width = this.base.width;
        this.node.setPosition(this.base.position);
        this.node.active = this.base.isVisible;
    }
}
