export interface LoginDTO {
    email: string;
    password: string;

    clientId: string;

    ipAddress: string;
    userAgent: string;
    browser?: string;
    os?: string;

    deviceId?: string;
    deviceName?: string;
}