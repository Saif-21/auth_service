export interface RegisterDTO {
    name: string;
    email: string;
    phone: string;
    password: string;
    clientId: string;
    ipAddress: string;
    userAgent: string;
    browser?: string;
    os?: string;
    deviceId?: string;
    deviceName?: string;
}
