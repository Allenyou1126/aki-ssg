import fs from "node:fs";
import path from "node:path";

const files_to_remove = [
	".friend-link.cms.json",
	".post-data.cms.json",
	".page-data.cms.json",
	".master.cms.lock",
	".loading.cms.lock",
];

await Promise.all(
	files_to_remove
		.map((file) => path.join(process.cwd(), file))
		.map((file) => fs.promises.unlink(file).catch(() => {})),
);
