export abstract class BaseEvent {
    public readonly id: string;
    public readonly timestamp: Date;
    public readonly version: string;

    constructor() {
        this.id = this.generateId();
        this.timestamp = new Date();
        this.version = '1.0';
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
    
    abstract getEventName(): string;
}
