export interface PermissionDTO {
    name: string;
    slug: string;
    description?: string;
    module?: string;
    action?: string;
    isSystem?: boolean;
    isActive?: boolean;
}
