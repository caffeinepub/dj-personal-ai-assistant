import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Plan {
    id: string;
    status: string;
    goal: string;
    stepsJson: string;
    createdAt: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePlan(id: string): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    getPlanById(id: string): Promise<Plan | null>;
    getPlans(): Promise<Array<Plan>>;
    isCallerAdmin(): Promise<boolean>;
    savePlan(id: string, goal: string, stepsJson: string, status: string): Promise<boolean>;
    updatePlan(id: string, goal: string, stepsJson: string, status: string): Promise<boolean>;
}
