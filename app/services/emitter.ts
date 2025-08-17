import { createEmitter } from "../base/utils/emitter";
import { AppEventMap } from "../interfaces/app-events";

export const emitter = createEmitter<AppEventMap>();