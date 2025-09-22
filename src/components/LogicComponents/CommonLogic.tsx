import AntiReverseProxy from "./AntiReverseProxy";
import { DarkModeClient } from "./DarkModeClient";
import { ScrollClient } from "./ScrollClient";

export default function CommonLogic() {
	return (
		<>
			<AntiReverseProxy />
			<DarkModeClient />
			<ScrollClient />
		</>
	);
}
