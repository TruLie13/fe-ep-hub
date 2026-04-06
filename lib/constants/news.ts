/** ISR for `/news` — keep in sync with `fetch().next.revalidate` in news fetchers. */
export const NEWS_PAGE_REVALIDATE_SECONDS = 900;

export const NEWS_REFRESH_MINUTES = Math.round(NEWS_PAGE_REVALIDATE_SECONDS / 60);
