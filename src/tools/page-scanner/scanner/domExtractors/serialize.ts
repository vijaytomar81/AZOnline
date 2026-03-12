import type { ScannedElement } from "../types";
import { inferLabelText, extractElementText } from "./labels";
import { resolveOwnerContext } from "./ownerContext";
import { getAttr } from "./utils";

export function serializeElement(el: Element): ScannedElement {
    const tag = el.tagName.toLowerCase();
    const role = getAttr(el, "role");
    const id = getAttr(el, "id");
    const nameAttr = getAttr(el, "name");

    const placeholder = getAttr(el, "placeholder");
    const ariaLabel = getAttr(el, "aria-label");
    const labelText = inferLabelText(el);
    const text = extractElementText(el);

    const href = tag === "a" ? getAttr(el, "href") : null;

    const dataTestId = getAttr(el, "data-testid");
    const dataTest = getAttr(el, "data-test");
    const dataQa = getAttr(el, "data-qa");

    const typeAttr = tag === "input" ? getAttr(el, "type") : null;

    const owner = resolveOwnerContext(el);

    const derivedName =
        ariaLabel ||
        labelText ||
        text ||
        placeholder ||
        nameAttr ||
        id ||
        owner.ownerLabelText ||
        owner.ownerAriaLabel ||
        owner.ownerGroupLabelFor ||
        null;

    return {
        tag,
        role,
        id,

        name: derivedName,
        text,
        href,

        dataTestId,
        dataTest,
        dataQa,

        labelText,
        ariaLabel,
        placeholder,
        inputName: nameAttr,
        typeAttr,
        valueAttr: null,

        ownerId: owner.ownerId,
        ownerLabelText: owner.ownerLabelText,
        ownerAriaLabel: owner.ownerAriaLabel,
        ownerGroupLabelFor: owner.ownerGroupLabelFor,
        isFrameworkSearchInput: owner.isFrameworkSearchInput,

        candidates: [],
        key: "",
    };
}