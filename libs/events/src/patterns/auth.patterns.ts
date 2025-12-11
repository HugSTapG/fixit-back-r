export const AUTH_PATTERNS = {
    // Autenticación
    LOGIN: 'auth.login',
    REFRESH: 'auth.refresh',
    LOGOUT: 'auth.logout',
    VALIDATE: 'auth.validate',

    // Gestión de usuarios
    FIND_USER_BY_ID: 'auth.user.findById',
    FIND_USER_BY_CEDULA: 'auth.user.findByCedula',
    FIND_USER_BY_EMAIL: 'auth.user.findByEmail',
    CREATE_USER: 'auth.user.create',
    UPDATE_USER: 'auth.user.update',
    FIND_ALL_USERS: 'auth.user.findAll',
    VERIFY_EMAIL: 'auth.user.verifyEmail',
    DEACTIVATE_USER: 'auth.user.deactivate',
    SWITCH_ROLE: 'auth.user.switchRole',

} as const;
