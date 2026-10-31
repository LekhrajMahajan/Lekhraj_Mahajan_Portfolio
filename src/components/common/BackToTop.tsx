/**
 * Consolidated re-export of the single authoritative scroll progress widget.
 * Ensures backward compatibility with any legacy imports while preventing duplicate widgets.
 */
export { ScrollIndicator as default, ScrollIndicator as BackToTop } from '../scroll-indicator/ScrollIndicator';
export type { ScrollIndicatorProps as BackToTopProps } from '../scroll-indicator/ScrollIndicator';
