import { GENERIC_CONTAINER_ID_RE, REACT_SELECT_INPUT_ID_RE } from "./constants";
import { getAttr, safeText } from "./utils";

export type OwnerContext = {
    ownerId: string | null;
    ownerLabelText: string | null;
    ownerAriaLabel: string | null;
    ownerGroupLabelFor: string | null;
    isFrameworkSearchInput: boolean;
};

function isMeaningfulOwnerId(value: string | null): boolean {
    if (!value) return false;
    if (REACT_SELECT_INPUT_ID_RE.test(value)) return false;
    if (/^\d+$/.test(value)) return false;
    if (GENERIC_CONTAINER_ID_RE.test(value)) return false;
    return true;
}

export function resolveOwnerContext(el: Element): OwnerContext {
    const id = getAttr(el, "id");
    const isFrameworkSearchInput = !!id && REACT_SELECT_INPUT_ID_RE.test(id);

    const formGroup = el.closest(".form-group");
    const inputGroup = el.closest(".input-group");

    let ownerId: string | null = null;
    let ownerLabelText: string | null = null;
    let ownerAriaLabel: string | null = null;
    let ownerGroupLabelFor: string | null = null;

    let cur: Element | null = el.parentElement;
    while (cur) {
        const curId = getAttr(cur, "id");
        if (isMeaningfulOwnerId(curId)) {
            ownerId = curId;
            break;
        }
        cur = cur.parentElement;
    }

    if (formGroup) {
        const label = formGroup.querySelector("label");
        ownerLabelText = safeText(label?.textContent ?? null);
        ownerGroupLabelFor = safeText(getAttr(label as Element, "for"));
    }

    if (inputGroup) {
        ownerAriaLabel = safeText(getAttr(inputGroup, "aria-label"));
    }

    return {
        ownerId,
        ownerLabelText,
        ownerAriaLabel,
        ownerGroupLabelFor,
        isFrameworkSearchInput,
    };
}