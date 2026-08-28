import { redirect } from "next/navigation";

/**
 * Proposals are no longer a section of their own.
 *
 * For one city and a two-person team, a "КП" is a price and a stage on the
 * lead — keeping a parallel register of documents meant the same deal was
 * updated in two places, and usually in only one. The route stays so old links
 * and bookmarks land somewhere sensible; the data and `lib/crm/repo`'s
 * proposal functions are untouched, so the screen can come back if the way we
 * sell changes.
 */
export default function ProposalsPage() {
  redirect("/admin/crm/leads");
}
