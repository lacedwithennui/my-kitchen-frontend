import IngredientTooltip from "../components/IngredientTooltip.vue";

export function useAdaptiveTooltip() {
    const ingredientContainerRefName = "ingredient-container";
    const ingredientContainerRef = useTemplateRef<HTMLSpanElement>(ingredientContainerRefName);
    const tooltipComponentRefName = "ingredient-tooltip";
    const tooltipComponentRef = useTemplateRef<InstanceType<typeof IngredientTooltip>>(tooltipComponentRefName);

    /**
     * Utility function for safely unwrapping tooltipRef with built-in guard
     */
    const getTooltipRef = () => {
        if (!tooltipComponentRef.value) {
            return;
        }
        return tooltipComponentRef.value.tooltipRef;
    };

    const setTooltipPosition = () => {
        const tooltipRef = getTooltipRef();
        if (!tooltipRef || !ingredientContainerRef.value || !window.visualViewport) {
            return;
        }

        /*
         * If the right side of the tooltip is past the right edge of the screen, move it to the left side of the ingredient-container
         */
        let tooltipBoundingRect = tooltipRef.getBoundingClientRect();
        if (tooltipBoundingRect.right > document.documentElement.clientWidth) {
            ingredientContainerRef.value.style.position = "relative";
            tooltipRef.classList.add("left-of-inline");
            tooltipRef.classList.remove("centered-on-screen");
        }

        /*
         * Refresh the boundingRect and check if our changes have made it go over the left edge of the screen, and center
         * the tooltip relative to viewport if they did
         */
        tooltipBoundingRect = tooltipRef.getBoundingClientRect();
        if (tooltipBoundingRect.left < 0) {
            ingredientContainerRef.value.style.position = "unset";
            tooltipRef.classList.add("centered-on-screen");
            tooltipRef.classList.remove("left-of-inline");
        }

        /*
         * If the tooltip goes off the bottom of the screen, preserve its horizontal position but put the tooltip above
         * the ingredient-wrapper
         */
        tooltipBoundingRect = tooltipRef.getBoundingClientRect();
        if (tooltipBoundingRect.bottom - window.visualViewport.offsetTop > document.documentElement.clientHeight) {
            tooltipRef.classList.add("above-inline");
        }

        tooltipRef.style.visibility = "visible";
    };

    const hideTooltip = () => {
        const tooltipRef = getTooltipRef();
        if (!tooltipRef) {
            return;
        }
        tooltipRef.style.visibility = "hidden";
    };

    const resetTooltipInlineStyles = () => {
        const tooltipRef = getTooltipRef();
        if (!tooltipRef) {
            return;
        }
        tooltipRef.classList.remove("left-of-inline");
        tooltipRef.classList.remove("centered-on-screen");
        tooltipRef.classList.remove("above-inline");
    };

    const resetTooltipVerticalPosition = () => {
        const tooltipRef = getTooltipRef();
        if (!tooltipRef) {
            return;
        }
        tooltipRef.classList.remove("above-inline");
    };

    const handleMouseEnter = setTooltipPosition;
    const handleMouseLeave = () => {
        hideTooltip();
        resetTooltipVerticalPosition();
    };

    onMounted(() => {
        window.addEventListener("resize", resetTooltipInlineStyles);
        window.addEventListener("scroll", resetTooltipVerticalPosition);
    });
    onUnmounted(() => {
        window.removeEventListener("resize", resetTooltipInlineStyles);
        window.removeEventListener("scroll", resetTooltipVerticalPosition);
    });

    return {
        ingredientContainerRefName,
        tooltipComponentRefName,
        setTooltipPosition,
        hideTooltip,
        resetTooltipInlineStyles,
        resetTooltipVerticalPosition,
        handleMouseEnter,
        handleMouseLeave
    };
}
