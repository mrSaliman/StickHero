import Stick from "../../Game/Stick/Stick";
import BaseViewController from "../BaseViewController";
import StickView from "./StickView";

const { ccclass } = cc._decorator;

@ccclass
export default class SticksViewController extends BaseViewController<Stick, StickView> {
    protected getViewClass(): { new (): StickView } {
        return StickView;
    }
}
