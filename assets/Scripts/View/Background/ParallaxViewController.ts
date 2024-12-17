import Parallax from "../../Game/Parallax/Parallax";
import BaseViewController from "../BaseViewController";
import ParallaxView from "./ParallaxView";

const { ccclass } = cc._decorator;

@ccclass
export default class ParallaxViewController extends BaseViewController<Parallax, ParallaxView> {

    private currentParallaxId = 0;

    public loadParallaxNodes(): number{
        this.viewFolder.getComponentsInChildren(ParallaxView).forEach(parallax => {
            this.viewList.push(parallax)
        });

        let maxHeight = 0;
        this.viewList.forEach(parallax => {
            maxHeight = Math.max(parallax.node.height, maxHeight);
        });

        let currentScale = this._currentFieldSize.height / maxHeight;

        this.viewList.forEach(parallax => {
            parallax.node.scale = currentScale;
        });

        return this.viewList.length;
    }

    protected onLoad(): void {
        if (this.viewFolder === null) {
            throw new Error("Required links (viewFolder) are missing");
        }
    }

    protected getViewClass(): { new (): ParallaxView } {
        return ParallaxView;
    }

    protected createView(base: Parallax): void {
        let view = this.getTargetView();
        if (!view) {
            throw new Error("ParallaxView is missing");
        }
        view.fieldSize = this._currentFieldSize;
        view.bottomIndentPercent = this.bottomIndentPercent;
        view.init(base);
    }

    private getTargetView(): ParallaxView {
        if (this.currentParallaxId >= this.viewList.length) return null;
        return this.viewList[this.currentParallaxId++];
    }
}
