import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { Alert, Box, Container, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import PageHero from "@/components/common/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import type { NewsLink } from "@/content/schema";
import { RecentFeedList } from "@/components/news/RecentFeedList";
import { NEWS_REFRESH_MINUTES } from "@/lib/constants/news";
import {
  fetchDataCenterNews,
  fetchNationalDataCenterNews,
} from "@/lib/content/fetch-news";
import { fetchRedditElPasoPosts } from "@/lib/content/fetch-reddit-elpaso";
import { dict } from "@/lib/i18n/dictionary";
import { buildPageJsonLd, buildPageMetadata } from "@/lib/seo/site";

/** Keep in sync with `NEWS_PAGE_REVALIDATE_SECONDS` in `@/lib/constants/news`. */
export const revalidate = 900;

const NEWS_SEO = {
  title: "News",
  description:
    "r/ElPaso posts, local data-center coverage, and national data-center coverage from Google News. Links open in a new tab.",
  path: "/news",
  schemaType: "CollectionPage",
} as const;

export const metadata: Metadata = buildPageMetadata(NEWS_SEO);

export default async function NewsPage() {
  const t = dict();
  const nt = t.news;

  let feedLinks: NewsLink[] = [];
  let nationalFeedLinks: NewsLink[] = [];
  let redditLinks: NewsLink[] = [];
  let feedError = false;
  let nationalFeedError = false;
  let redditError = false;

  try {
    feedLinks = await fetchDataCenterNews();
  } catch {
    feedError = true;
  }
  try {
    nationalFeedLinks = await fetchNationalDataCenterNews();
  } catch {
    nationalFeedError = true;
  }

  try {
    redditLinks = await fetchRedditElPasoPosts();
  } catch {
    redditError = true;
  }

  const hasFeed = feedLinks.length > 0;
  const hasNationalFeed = nationalFeedLinks.length > 0;
  const hasReddit = redditLinks.length > 0;

  const sectionGap = { mb: 5 as const };

  const lastUpdatedNote = nt.lastUpdatedNote.replace(
    "{minutes}",
    String(NEWS_REFRESH_MINUTES),
  );

  return (
    <Box>
      <JsonLd data={buildPageJsonLd(NEWS_SEO)} />
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

      <Stack spacing={2} sx={{ mt: 5 }}>
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <RssFeedRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: "0.14em" }}>
              {nt.nationalFeedSection}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {nt.nationalFeedNote}
          </Typography>
        </Stack>
        {nationalFeedError ? (
          <Alert severity="info">{nt.googleLoadError}</Alert>
        ) : null}
        {hasNationalFeed ? (
          <RecentFeedList
            listLabel={nt.nationalFeedSection}
            items={nationalFeedLinks}
            openLabel={t.common.openLink}
            showMoreLabel={nt.showMoreFeed}
            allLoadedLabel={nt.feedAllLoaded}
          />
        ) : null}
        {!nationalFeedError && !hasNationalFeed ? (
          <Typography variant="body2" color="text.secondary">
            {nt.noNationalFeedResults}
          </Typography>
        ) : null}
      </Stack>
      </Container>
    </Box>
  );
}
