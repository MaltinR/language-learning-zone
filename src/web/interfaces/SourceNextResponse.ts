import type IdText from "../../idText";
import type SourceNextRequest from "./SourceNextRequest";

export default interface SourceNextResponse {
    input: SourceNextRequest,
    sourceProvider: IdText,
    result: string;
}