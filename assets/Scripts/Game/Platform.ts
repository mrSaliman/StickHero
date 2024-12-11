class Platform implements IPoolable {
    public width: number = 0;
    public position: cc.Vec2 = cc.Vec2.ZERO;
    public isVisible: boolean = false;
    
    private _dataChanged = new Delegate();
    public get dataChanged() {
        return this._dataChanged;
    }

    reset(): void {
        this.isVisible = false;
        this.position = cc.Vec2.ZERO;
        this.width = 0;
        this._dataChanged.emit();
    }

    setPosition(position: cc.Vec2): void {
        this.position = position;
        this._dataChanged.emit();
    }

    setWidth(width: number): void {
        this.width = width;
        this._dataChanged.emit();
    }

    setVisible(isVisible: boolean): void {
        this.isVisible = isVisible;
        this._dataChanged.emit();
    }

}