import { IRouteParams } from "../base/lib/router";
import { BaseEventMap } from "../base/utils/emitter";

export interface AppEventMap extends BaseEventMap {
    'flags-changed': { flags: any },
    'month-clicked': { jd: number, jm: number, jy: number },
    'day-clicked': { jd: number, jm: number, jy: number },
    'move-month-by-one': -1 | 1,
    'tab-clicked': string,
    'client-added': { client: any }
}