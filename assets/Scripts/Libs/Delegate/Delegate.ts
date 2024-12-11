type Listener<T extends any[]> = (...args: T) => void;

class Delegate<T extends any[]> {
    private listeners: Listener<T>[] = [];

    on(listener: Listener<T>): void {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }

    off(listener: Listener<T>): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    emit(...args: T): void {
        this.listeners.forEach(listener => listener(...args));
    }
}