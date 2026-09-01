import { ref } from "vue";
import type { CitationList } from "../utils/models/shared/citation.ts";

export function useInlineCitations() {
    const citationList = shallowRef<CitationList>({});
    const citationListLength = ref(0);

    const addToCitationList = (href: string, displayText: string) => {
        if (!citationList.value[href]) {
            citationList.value[href] = {
                href,
                displayText,
                displayIndex: ++citationListLength.value
            };
        }
        return citationListLength.value;
    };

    const highlightBibliographyEntry = (href: string, timeoutId?: number) => {
        if (!citationList.value[href]) {
            return;
        }
        const bibliographyCitation = document.getElementById(
            `bibliography-citation-${citationList.value[href].displayIndex}`
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
