import { ClientPlatform, TokenTransport } from "../types/client.types";

export interface ClientDTO {
    name: string;
    clientId: string;
    clientSecret: string;
    platform: ClientPlatform;
    tokenTransport: TokenTransport;
    allowedOrigins: string[];
    isActive: boolean;
}
