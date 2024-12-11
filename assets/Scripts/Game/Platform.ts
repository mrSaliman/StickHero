type Listener = () => void;

class Platform implements IPoolable {
    public width: number = 0;
    public position: cc.Vec2 = cc.Vec2.ZERO;
    public isVisible: boolean = false;

    private listeners: Listener[] = [];

    reset(): void {
        this.isVisible = false;
        this.position = cc.Vec2.ZERO;
        this.width = 0;
        this.notifyChange();
    }

    setPosition(position: cc.Vec2): void {
        this.position = position;
        this.notifyChange();
    }

    setWidth(width: number): void {
        this.width = width;
        this.notifyChange();
    }

    setVisible(isVisible: boolean): void {
        this.isVisible = isVisible;
        this.notifyChange();
    }

    onDataChanged(listener: Listener): void {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }

    offDataChanged(listener: Listener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    private notifyChange(): void {
        this.listeners.forEach(listener => listener());
    }
}