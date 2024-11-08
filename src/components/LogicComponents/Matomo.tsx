"use client";

import Script from "next/script";

export function Matomo() {
	return (
		<Script strategy="lazyOnload" id="matomo">
			{`const _paq = ((window as any)._paq = (window as any)._paq || []);_paq.push(["trackPageView"]);_paq.push(["enableLinkTracking"]);(function () {const u = "https://stat.allenyou.wang/";_paq.push(["setTrackerUrl", u + "matomo.php"]);_paq.push(["setSiteId", "4"]);const d = document,g = d.createElement("script"),s = d.getElementsByTagName("script")[0];g.async = true;g.src = u + "matomo.js";s.parentNode!.insertBefore(g, s);})();`}
		</Script>
	);
}
