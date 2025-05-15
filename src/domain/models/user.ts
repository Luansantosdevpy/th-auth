export interface User {
    _id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    organizationId: string;
    permissions?: string[]; 
}