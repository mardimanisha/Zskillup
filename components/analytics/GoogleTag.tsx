/**
 * Google tag (GTM-59FB7JZ4), exactly as Google's "Install manually" instructions give it.
 * Rendered as the first thing inside <head> in every root layout, so it lands on every
 * page of zskillup.com. Don't add a second Google tag to any page.
 */
const GTM_ID = "GTM-59FB7JZ4";

export function GoogleTag() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
        }}
      />
    </>
  );
}
