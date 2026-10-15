<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve the uploaded storefront’s TanStack file routes and semantic theme for presentation changes.
- Keep header notification activity in a session-only store and use the shared notify helper for account-action Sonner messages; this preserves the uploaded demo behavior without implying remote delivery.
- Mount the themed Toaster once at the root and use the shared NotificationButton in the header and side rail so all placements share activity and read state.
- Footer social links use official SVG logo paths with CSS interaction motion rather than external Lottie frames so the logos stay recognizable and theme-aware throughout animation.
- Products that differ only by color/size words in the name (same first category) are grouped into a family at catalog load; listings show one card per family and the product page links between members, because the source catalog stores each color as a separate product.
