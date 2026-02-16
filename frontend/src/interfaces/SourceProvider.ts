import type Lang from "./Lang";

export default interface SourceProvider {
  id: string;
  name: string;
  langs: Array<Lang>;
}