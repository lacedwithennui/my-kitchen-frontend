import IngredientTooltip from "../components/IngredientTooltip.vue";

export function useAdaptiveTooltip(hasTooltip: boolean = true) {
    const ingredientContainerRefName = "ingredient-container";
    const ingredientContainerRef = useTemplateRef<HTMLSpanElement>(ingredientContainerRefName);
    const tooltipComponentRefName = "ingredient-tooltip";
    const tooltipComponentRef = useTemplateRef<InstanceType<typeof IngredientTooltip>>(tooltipComponentRefName);

    const noOp = () => {};

    if (!hasTooltip) {
        return {
            ingredientContainerRefName: noOp,
            tooltipComponentRefName: noOp,
            handleMouseEnter: noOp,
            handleMouseLeave: noOp
        };
    }

    /**
     * Utility function for safely unwrapping tooltipRef with built-in guard
     */
    const getTooltipRef = () => {
        if (!tooltipComponentRef.value) {
            return;
        }
        return tooltipComponentRef.value.tooltipRef;
    };

    // TODO: Research CSS anchor positioning as an alternative to the JS positioning logic
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Try_options_hiding
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
            // Let the stylesheet set position: relative
            ingredientContainerRef.value.style.position = "";
            tooltipRef.classList.add("left-of-inline");
            tooltipRef.classList.remove("centered-on-screen");
        }

        /*
         * Refresh the boundingRect and check if our changes have made it go over the left edge of the screen, and center
         * the tooltip relative to viewport if they did
         */
        tooltipBoundingRect = tooltipRef.getBoundingClientRect();
        if (tooltipBoundingRect.left < 0) {
            ingredientContainerRef.value.style.position = "static";
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
    };

    const showTooltip = () => {
        const tooltipRef = getTooltipRef();
        if (!tooltipRef) {
            return;
        }
        tooltipRef.style.visibility = "visible";
    };

    const hideTooltip = () => {
        const tooltipRef = getTooltipRef();
        if (!tooltipRef) {
            return;
        }
        // Let the stylesheet set visibility: hidden
        tooltipRef.style.visibility = "";
    };

    const resetTooltipPosition = () => {
        const tooltipRef = getTooltipRef();
        if (!tooltipRef || !ingredientContainerRef.value) {
            return;
        }
        ingredientContainerRef.value.style.position = "";
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

    const handleMouseEnter = () => {
        setTooltipPosition();
        showTooltip();
    };

    const handleMouseLeave = () => {
        hideTooltip();
        resetTooltipVerticalPosition();
    };

    onMounted(() => {
        window.addEventListener("resize", resetTooltipPosition);
        window.addEventListener("scroll", resetTooltipVerticalPosition);
        // Set position on mount to avoid hidden components causing overflow
        setTooltipPosition();
    });
    onUnmounted(() => {
        window.removeEventListener("resize", resetTooltipPosition);
        window.removeEventListener("scroll", resetTooltipVerticalPosition);
    });

    return {
        ingredientContainerRefName,
        tooltipComponentRefName,
        handleMouseEnter,
        handleMouseLeave
    };
}
