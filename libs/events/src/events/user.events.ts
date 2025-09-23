import { BaseEvent } from './base.event';

export class UserCreatedEvent extends BaseEvent {
    constructor(
        public readonly userId: number,
        public readonly email: string,
        public readonly rol: string,
        public readonly cedula: string
    ) {
        super();
    }

    getEventName(): string {
        return 'user.created';
    }
}

export class UserUpdatedEvent extends BaseEvent {
    constructor(
        public readonly userId: number,
        public readonly changes: Record<string, any>
    ) {
        super();
    }

    getEventName(): string {
        return 'user.updated';
    }
}

export class UserDeactivatedEvent extends BaseEvent {
    constructor(
        public readonly userId: number,
        public readonly deactivatedBy: number
    ) {
        super();
    }

    getEventName(): string {
        return 'user.deactivated';
    }
}

export class UserRoleSwitchedEvent extends BaseEvent {
    constructor(
        public readonly userId: number,
        public readonly oldRole: string,
        public readonly newRole: string
    ) {
        super();
    }

    getEventName(): string {
        return 'user.role_switched';
    }
}
