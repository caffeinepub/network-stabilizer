import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type TestType = {
    __kind__: "pingTest";
    pingTest: null;
} | {
    __kind__: "connectivityCheck";
    connectivityCheck: DeviceConnectivityType;
} | {
    __kind__: "throughputTest";
    throughputTest: null;
} | {
    __kind__: "dnsResolution";
    dnsResolution: null;
};
export interface UserProfile {
    name: string;
}
export interface NetworkCheckResult {
    checkId: bigint;
    dnsResolutionMs?: bigint;
    pingTimeMs?: bigint;
    testType: TestType;
    description: string;
    errorMessages?: string;
    timestamp: bigint;
    resultCode: ResultCode;
}
export enum DeviceConnectivityType {
    usb = "usb",
    wifi = "wifi",
    ethernet = "ethernet",
    mobileData = "mobileData"
}
export enum ResultCode {
    bad = "bad",
    good = "good",
    unknown_ = "unknown"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearNetworkHistory(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserNetworkHistory(user: Principal, maxResults: bigint | null): Promise<Array<NetworkCheckResult>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveNetworkCheckResult(result: NetworkCheckResult): Promise<void>;
}
