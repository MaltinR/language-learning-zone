export default interface ExplainResponse {
  type: "result" | "deltaText";
  deltaText: string;
}