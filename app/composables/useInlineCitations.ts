import { ref } from "vue";
import type { CitationList } from "../utils/models/citation.ts";

export function useInlineCitations() {
    const citationList = ref<CitationList>({});
    const lastCitationDisplayIndex = ref(0);

    const addToCitationList = (href: string, displayText: string) => {
        if (!Object.hasOwn(citationList.value, href)) {
            citationList.value[href] = {
                href,
                displayText,
                displayIndex: ++lastCitationDisplayIndex.value
            };
        }
        return lastCitationDisplayIndex.value;
    };

    const highlightBibliographyEntry = (href: string, timeoutId?: number) => {
        if (!Object.hasOwn(citationList.value, href)) {
            return;
        }
        const bibliographyCitation = document.getElementById(
            `bibliography-citation-${citationList.value[href]!.displayIndex}`
        );
        if (!bibliographyCitation) {
            return;
        }
        bibliographyCitation.classList.add("highlighted");
        clearTimeout(timeoutId);
        return setTimeout(() => {
            bibliographyCitation.classList.remove("highlighted");
        }, 1500);
    };

    return { citationList, addToCitationList, highlightBibliographyEntry };
}
