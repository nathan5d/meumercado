import { LitElement } from "lit";
import { IconWeight } from "../types";
export default class PhCaretCircleDoubleUp extends LitElement {
    static weightsMap: Map<IconWeight, import("lit-html").TemplateResult<2>>;
    size: string | number;
    weight: IconWeight;
    color: string;
    mirrored: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "ph-caret-circle-double-up": PhCaretCircleDoubleUp;
    }
}
