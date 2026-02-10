import type IdText from "../../idText";
import type TranslateRequest from "./TranslateRequest";

export default interface TranslateResponse {
    input: TranslateRequest,
    translator: IdText,
    result: string;
}