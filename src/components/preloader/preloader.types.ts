export interface PreloaderProps {
  /**
   * Called when the preloader exit animation completes and the preloader is ready to be unmounted.
   */
  onComplete?: () => void;

  /**
   * Called ~40% into the exit animation to begin revealing the Hero and Navbar.
   */
  onExitStart?: () => void;

  /**
   * Display name / brand title shown in large condensed typography.
   * Default: "Lekhraj Mahajan"
   */
  brandTitle?: string;

  /**
   * First name shown on the top line of the stacked preloader title.
   * e.g. "LEKHRAJ"
   */
  firstName?: string;

  /**
   * Last name shown on the bottom line of the stacked preloader title.
   * e.g. "MAHAJAN"
   */
  lastName?: string;

  /**
   * Top small uppercase label above the brand title.
   * Default: "PORTFOLIO LOADING"
   */
  tagline?: string;

  /**
   * Status text shown on the bottom left of the progress indicator.
   * Default: "PREPARING INTERFACE"
   */
  statusText?: string;

  /**
   * Maximum safety timeout in milliseconds to prevent the loader from getting stuck.
   * Default: 2500
   */
  maxTimeoutMs?: number;

  /**
   * Increment step duration in ms for progress counter.
   */
  tickIntervalMs?: number;
}
