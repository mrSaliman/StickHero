type Listener<T extends any[]> = (...args: T) => void;

export class Delegate<T extends any[]> {
    private listeners: ((...args: T) => void)[] = [];

    on = (listener: Listener<T>): void => {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    };

    off = (listener: Listener<T>): void => {
        this.listeners = this.listeners.filter(l => l !== listener);
    };

    emit = (...args: T): void => {
        this.listeners.forEach(listener => listener(...args));
    };
}
