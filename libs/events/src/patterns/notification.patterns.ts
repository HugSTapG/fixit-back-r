export const NOTIFICATION_PATTERNS = {
    // Notificaciones CRUD
    FIND_ALL_NOTIFICACIONES: 'notification.notificaciones.findAll',
    FIND_NOTIFICACION_BY_ID: 'notification.notificaciones.findOne',
    CREATE_NOTIFICACION: 'notification.notificaciones.create',
    UPDATE_NOTIFICACION: 'notification.notificaciones.update',
    DELETE_NOTIFICACION: 'notification.notificaciones.delete',

    // Funciones especiales de notificaciones
    CREATE_SYSTEM_NOTIFICATION: 'notification.notificaciones.createSystem',
    MARCAR_COMO_LEIDA: 'notification.notificaciones.marcarLeida',
    MARCAR_TODAS_LEIDAS: 'notification.notificaciones.marcarTodasLeidas',
    FIND_BY_USER: 'notification.notificaciones.findByUser',
    GET_UNREAD_COUNT: 'notification.notificaciones.getUnreadCount',
    GET_STATS: 'notification.notificaciones.getStats',
    CLEANUP_OLD_NOTIFICATIONS: 'notification.notificaciones.cleanupOld',

    // Tokens de notificaciones CRUD
    FIND_ALL_TOKENS: 'notification.tokens.findAll',
    FIND_TOKEN_BY_ID: 'notification.tokens.findOne',
    REGISTER_TOKEN: 'notification.tokens.register',
    UPDATE_TOKEN: 'notification.tokens.update',
    DELETE_TOKEN: 'notification.tokens.delete',

    // Funciones especiales de tokens
    FIND_ACTIVE_TOKENS_BY_USER: 'notification.tokens.findActiveByUser',
    DEACTIVATE_TOKEN: 'notification.tokens.deactivate',
    GET_TOKEN_STATS: 'notification.tokens.getStats',
    CLEANUP_EXPIRED_TOKENS: 'notification.tokens.cleanupExpired',

    // Push notifications
    SEND_PUSH_TO_USER: 'notification.push.sendToUser',
    SEND_PUSH_TO_MULTIPLE_USERS: 'notification.push.sendToMultipleUsers',

    // Notificaciones específicas del sistema
    SEND_WELCOME_NOTIFICATION: 'notification.push.sendWelcome',
    SEND_NEW_REQUEST_NOTIFICATION: 'notification.push.sendNewRequest',
    SEND_PROPOSAL_NOTIFICATION: 'notification.push.sendProposal',
    SEND_PROPOSAL_ACCEPTED_NOTIFICATION: 'notification.push.sendProposalAccepted',
    SEND_SERVICE_COMPLETED_NOTIFICATION: 'notification.push.sendServiceCompleted',
    SEND_RATING_RECEIVED_NOTIFICATION: 'notification.push.sendRatingReceived',
    SEND_PAYMENT_REMINDER_NOTIFICATION: 'notification.push.sendPaymentReminder',
} as const;
