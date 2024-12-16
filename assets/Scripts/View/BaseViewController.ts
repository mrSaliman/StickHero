import Delegate from "../Libs/Delegate/Delegate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseViewController<TBase, TView extends cc.Component> extends cc.Component {
    protected viewList: TView[] = [];

    @property(cc.Prefab)
    public viewPrefab: cc.Prefab = null;

    @property(cc.Node)
    public viewFolder: cc.Node = null;

    @property({
        min: 0.01,
        max: 0.99,
    })
    public bottomIndentPercent: number = 0.15;

    protected _currentFieldSize: cc.Size = null;

    public updateFieldSize(size: cc.Size): void {
        this._currentFieldSize = size;
        this.viewList.forEach((view) => {
            (view as any).fieldSize = size;
        });
    }

    protected onLoad(): void {
        if (this.viewPrefab === null || this.viewFolder === null) {
            throw new Error("Required links (viewPrefab or viewFolder) are missing");
        }
    }

    public init(baseController: { objectCreated: Delegate<[TBase]> }): void {
        baseController.objectCreated.on((base: TBase) => this.createView(base));
    }

    protected createView(base: TBase): void {
        const node = cc.instantiate(this.viewPrefab);
        this.viewFolder.addChild(node);

        const view = node.getComponent<TView>(this.getViewClass());
        if (!view) {
            throw new Error(`Prefab must have a component of type ${this.getViewClass().name}`);
        }

        (view as any).fieldSize = this._currentFieldSize;
        (view as any).bottomIndentPercent = this.bottomIndentPercent;
        (view as any).init(base);

        this.viewList.push(view);
    }

    protected getViewClass(): { new (): TView } {
        return null as any;
    }
}
