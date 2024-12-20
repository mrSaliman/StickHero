import Label from "../../Game/UI/Label";
import LabelView from "./LabelView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIController extends cc.Component {

    @property(cc.Node)
    startUINode: cc.Node = null;

    @property(cc.Node)
    gameUINode: cc.Node = null;

    @property(LabelView)
    gameScore: LabelView = null;

    @property(LabelView)
    resultGameScore: LabelView = null;

    @property(LabelView)
    collectableScore: LabelView = null;

    @property(LabelView)
    resultCollectableScore: LabelView = null;

    @property(LabelView)
    perfectLabel: LabelView = null;

    @property(cc.Node)
    loseUINode: cc.Node = null;

    @property(cc.Node)
    uiCoverNode: cc.Node = null;

    private uiCover: cc.BlockInputEvents = null;

    private animationTime = 0.5;

    protected onLoad(): void {
        if (this.uiCoverNode === null || 
            this.loseUINode === null || 
            this.gameUINode === null || 
            this.startUINode === null || 
            this.gameScore === null ||
            this.resultGameScore === null ||
            this.perfectLabel === null
        ){
            throw new Error("links missing");
        }
        this.uiCover = this.uiCoverNode.getComponent(cc.BlockInputEvents);
    }

    public initScoreLabel(base: Label){
        this.gameScore.init(base);
        this.resultGameScore.init(base);
    }

    public initCollectableLabel(base: Label){
        this.collectableScore.init(base);
        this.resultCollectableScore.init(base);
    }

    public initPerfectLabel(base: Label){
        this.perfectLabel.init(base);
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
