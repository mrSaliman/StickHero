import Delegate from "../Libs/Delegate/Delegate";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UserInput extends cc.Component {

    private _TouchStarted = new Delegate();
    public get TouchStarted() {
        return this._TouchStarted;
    }

    private _TouchEnded = new Delegate();
    public get TouchEnded() {
        return this._TouchEnded;
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._TouchStarted.emit, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._TouchEnded.emit, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._TouchEnded.emit, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._TouchStarted.emit, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._TouchEnded.emit, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._TouchEnded.emit, this);
    }
}
