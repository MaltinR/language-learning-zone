export default interface NextResponse {
  input: {
    lang: string;
  };
  sourceProvider: {
    id: string;
    name: string;
  };
  result: string;
}