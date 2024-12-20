import Collectable from "../../Game/Collectable/Collectable";
import BaseViewController from "../BaseViewController";
import CollectableView from "./CollectableView";

const { ccclass } = cc._decorator;

@ccclass
export default class CollectablesViewController extends BaseViewController<Collectable, CollectableView> {
    protected getViewClass(): { new (): CollectableView } {
        return CollectableView;
    }
}
