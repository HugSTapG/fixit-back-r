export const USER_PATTERNS = {
    FIND_BY_ID: 'user.findById',
    FIND_BY_CEDULA: 'user.findByCedula',
    FIND_BY_EMAIL: 'user.findByEmail',
    CREATE: 'user.create',
    UPDATE: 'user.update',
    FIND_ALL: 'user.findAll',
    VERIFY_EMAIL: 'user.verifyEmail',
    DEACTIVATE: 'user.deactivate',
    SWITCH_ROLE: 'user.switchRole',
} as const;
