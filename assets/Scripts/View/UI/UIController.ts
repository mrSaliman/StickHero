const { ccclass, property } = cc._decorator;

@ccclass
export default class UIController extends cc.Component {

    @property(cc.Node)
    startUINode: cc.Node = null;

    @property(cc.Node)
    gameUINode: cc.Node = null;

    @property(cc.Node)
    loseUINode: cc.Node = null;

    @property(cc.Node)
    uiCoverNode: cc.Node = null;

    private uiCover: cc.BlockInputEvents = null;

    private animationTime = 0.5;

    protected onLoad(): void {
        if (this.uiCoverNode === null || this.loseUINode === null || this.gameUINode === null || this.startUINode === null){
            throw new Error("links missing");
        }
        this.uiCover = this.uiCoverNode.getComponent(cc.BlockInputEvents);
    }

    disableStartUI() {
        this.uiCover.enabled = false;
        this.startUINode.active = false;
    }

    disableGameUI() {
        this.gameUINode.active = false;
    }

    disableLoseUI() {
        cc.tween(this.uiCoverNode)
            .to(this.animationTime, {opacity: 0})
            .call(() => {
                this.uiCover.enabled = false;
            })
            .start();
        cc.tween(this.loseUINode)
            .to(this.animationTime, {opacity: 0})
            .call(() => {
                this.loseUINode.active = false;
            })
            .start();
    }

    enableStartUI() {
        this.uiCover.enabled = true;
        this.startUINode.active = true;
    }

    enableGameUI() {
        this.gameUINode.active = true;
    }

    enableLoseUI() {
        this.uiCover.enabled = true;
        this.loseUINode.active = true;
        cc.tween(this.uiCoverNode)
            .to(this.animationTime, {opacity: 100})
            .start();
        cc.tween(this.loseUINode)
            .to(this.animationTime, {opacity: 255})
            .start();
    }
}
