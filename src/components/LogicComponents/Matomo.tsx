"use client";

import Script from "next/script";

export function Matomo() {
	return (
		<Script strategy="lazyOnload" id="matomo">
			{`var _paq = (window._paq = window._paq || []);_paq.push(["trackPageView"]);_paq.push(["enableLinkTracking"]);(function () {var u = "https://stat.allenyou.wang/";_paq.push(["setTrackerUrl", u + "matomo.php"]);_paq.push(["setSiteId", "4"]);var d = document,g = d.createElement("script"),s = d.getElementsByTagName("script")[0];g.async = true;g.src = u + "matomo.js";s.parentNode.insertBefore(g, s);})();`}
		</Script>
	);
}
