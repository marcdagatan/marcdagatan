import Script from "next/script";

export function Matomo() {
  const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL || "//analytics.madsoftware.tech/";
  const siteId = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || "3";

  return (
    <>
      <Script id="matomo-init" strategy="afterInteractive">
        {`
var _paq = window._paq = window._paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u='${matomoUrl}';
  _paq.push(['setTrackerUrl', u + 'matomo.php']);
  _paq.push(['setSiteId', '${siteId}']);
})();
        `}
      </Script>
      <Script id="matomo-src" strategy="afterInteractive" src={`${matomoUrl}matomo.js`} />
    </>
  );
}


