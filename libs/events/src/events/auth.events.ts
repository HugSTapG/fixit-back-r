import { BaseEvent } from './base.event';

export class UserLoggedInEvent extends BaseEvent {
    constructor(
        public readonly userId: number,
        public readonly email: string,
        public readonly rol: string
    ) {
        super();
    }

    getEventName(): string {
        return 'user.logged_in';
    }
}

export class UserLoggedOutEvent extends BaseEvent {
    constructor(
        public readonly userId: number,
        public readonly sessionId: string
    ) {
        super();
    }

    getEventName(): string {
        return 'user.logged_out';
    }
}

export class TokenRefreshedEvent extends BaseEvent {
    constructor(
        public readonly userId: number,
        public readonly newTokenId: string
    ) {
        super();
    }

    getEventName(): string {
        return 'token.refreshed';
    }
}
