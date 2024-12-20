import Player from "../../Game/Player/Player";
import BaseViewController from "../BaseViewController";
import PlayerView from "./PlayerView";

const { ccclass } = cc._decorator;

@ccclass
export default class PlayerViewController extends BaseViewController<Player, PlayerView> {
    protected getViewClass(): { new (): PlayerView } {
        return PlayerView;
    }

    private _contactCallback: (other: cc.Collider) => void;
    public get contactCallback(): (other: cc.Collider) => void {
        return this._contactCallback;
    }
    public set contactCallback(value: (other: cc.Collider) => void) {
        this._contactCallback = value;
    }

    protected createView(base: Player): void {
        const node = cc.instantiate(this.viewPrefab);
        this.viewFolder.addChild(node);

        const view = node.getComponent<PlayerView>(this.getViewClass());
        if (!view) {
            throw new Error(`Prefab must have a component of type ${this.getViewClass().name}`);
        }

        view.fieldSize = this._currentFieldSize;
        view.bottomIndentPercent = this.bottomIndentPercent;
        view.initWithContact(base, this._contactCallback);

        this.viewList.push(view);
    }
}
