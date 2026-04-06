import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import type { NewsLink } from "@/content/schema";
import { RecentFeedList } from "@/components/news/RecentFeedList";
import { NEWS_REFRESH_MINUTES } from "@/lib/constants/news";
import { fetchDataCenterNews } from "@/lib/content/fetch-news";
import { fetchRedditElPasoPosts } from "@/lib/content/fetch-reddit-elpaso";
import { dict } from "@/lib/i18n/dictionary";

/** Keep in sync with `NEWS_PAGE_REVALIDATE_SECONDS` in `@/lib/constants/news`. */
export const revalidate = 900;

export const metadata: Metadata = {
  title: "News",
  description:
    "r/ElPaso posts and data-center coverage from Google News. Links open in a new tab.",
};

export default async function NewsPage() {
  const t = dict();
  const nt = t.news;

  let feedLinks: NewsLink[] = [];
  let redditLinks: NewsLink[] = [];
  let feedError = false;
  let redditError = false;

  try {
    feedLinks = await fetchDataCenterNews();
  } catch {
    feedError = true;
  }

  try {
    redditLinks = await fetchRedditElPasoPosts();
  } catch {
    redditError = true;
  }

  const hasFeed = feedLinks.length > 0;
  const hasReddit = redditLinks.length > 0;

  const sectionGap = { mb: 5 as const };

  const lastUpdatedNote = nt.lastUpdatedNote.replace(
    "{minutes}",
    String(NEWS_REFRESH_MINUTES),
  );

  return (
    <Box>
      <PageHero
        title={nt.title}
        subtitle={nt.subtitle}
        meta={
          <Typography variant="caption" color="text.secondary" maxWidth="70ch" component="p" sx={{ m: 0 }}>
            {lastUpdatedNote}
          </Typography>
        }
      />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {redditError || hasReddit ? (
        <Stack spacing={2} sx={sectionGap}>
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ForumRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: "0.14em" }}>
                {nt.redditSection}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {nt.redditNote}
            </Typography>
          </Stack>
          {redditError ? (
            <Alert severity="info">{nt.redditLoadError}</Alert>
          ) : null}
          {hasReddit ? (
            <RecentFeedList
              listLabel={nt.redditSection}
              items={redditLinks}
              openLabel={t.common.openLink}
              showMoreLabel={nt.showMoreFeed}
              allLoadedLabel={nt.redditAllLoaded}
              videoLabel={nt.videoPost}
            />
          ) : null}
        </Stack>
      ) : null}

      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <RssFeedRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: "0.14em" }}>
              {nt.feedSection}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {nt.feedNote}
          </Typography>
        </Stack>
        {feedError ? (
          <Alert severity="info">{nt.googleLoadError}</Alert>
        ) : null}
        {hasFeed ? (
          <RecentFeedList
            listLabel={nt.feedSection}
            items={feedLinks}
            openLabel={t.common.openLink}
            showMoreLabel={nt.showMoreFeed}
            allLoadedLabel={nt.feedAllLoaded}
          />
        ) : null}
        {!feedError && !hasFeed ? (
          <Typography variant="body2" color="text.secondary">
            {nt.noFeedResults}
          </Typography>
        ) : null}
      </Stack>
      </Container>
    </Box>
  );
}
