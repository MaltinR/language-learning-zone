import type { Role } from "../types/Role";

export default interface MessageData {
    role: Role;
    text: string;
}