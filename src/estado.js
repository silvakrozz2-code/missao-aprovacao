import { useSyncExternalStore } from "react";
import * as N from "./nucleo/nucleo.js";
export const useNucleo = () => { useSyncExternalStore(N.subscribe, N.getVersao); return N; };
export { N };
