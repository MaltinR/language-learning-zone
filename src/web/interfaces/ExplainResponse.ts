import type IdText from "../../idText";
import type ExplainRequest from "./ExplainRequest";

export default interface ExplainResponse {
    input: ExplainRequest,
    explainer: IdText,
    result: string;
}