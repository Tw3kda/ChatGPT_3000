import { Candidate } from "./AppInterfaces";
import { UsageMetadata } from "./AppInterfaces";

export interface APIResponse {
    candidates:    Candidate[];
    usageMetadata: UsageMetadata;
    modelVersion:  string;
}