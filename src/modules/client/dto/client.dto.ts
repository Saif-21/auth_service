import { SessionPlatform } from "@/modules/session/types/session.types";
import { TokenTransport } from "../types/client.types";

export interface ClientDTO {
    name: string;
    clientId: string;
    clientSecret: string;
    platform: SessionPlatform;
    tokenTransport: TokenTransport;
    allowedOrigins: string[];
    isActive: boolean;
}
