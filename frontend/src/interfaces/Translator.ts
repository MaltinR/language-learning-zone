import type Lang from "./Lang";

export default interface Translator {
  id: string;
  name: string;
  fromLangs: Array<Lang>;
  toLangs: Array<Lang>;
}