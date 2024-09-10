import {User} from "./user";

export interface UserResponse {
    totalOfUsers: number;
    numberOfUsers: number;
    page: number;
    size: number;
    hasNext?: boolean;
    hasPrevious: boolean;
    users: User[];
}