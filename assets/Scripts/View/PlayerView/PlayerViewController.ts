import Player from "../../Game/Player/Player";
import BaseViewController from "../BaseViewController";
import PlayerView from "./PlayerView";

const { ccclass } = cc._decorator;

@ccclass
export default class PlayerViewController extends BaseViewController<Player, PlayerView> {
    protected getViewClass(): { new (): PlayerView } {
        return PlayerView;
    }
}
