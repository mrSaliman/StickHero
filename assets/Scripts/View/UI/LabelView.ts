import Label from "../../Game/UI/Label";
import BaseView from "../BaseView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LabelView extends BaseView<Label> {

    @property(cc.Label)
    targetLabel: cc.Label = null;

    protected onOriginDataChanged(): void {
        if (this.base === null) {
            throw new Error("Base is not defined");
        }
        this.targetLabel.string = this.base.content;
    }

}
