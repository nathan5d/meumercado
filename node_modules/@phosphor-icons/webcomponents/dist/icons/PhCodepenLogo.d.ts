import { LitElement } from "lit";
import { IconWeight } from "../types";
export default class PhCodepenLogo extends LitElement {
    static weightsMap: Map<IconWeight, import("lit-html").TemplateResult<2>>;
    size: string | number;
    weight: IconWeight;
    color: string;
    mirrored: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "ph-codepen-logo": PhCodepenLogo;
    }
}
