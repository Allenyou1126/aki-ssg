import fs from "node:fs";
import chokidar from "chokidar";
import { delay } from "./delay";

export async function tryObtainLock(
	filePath: string,
): Promise<(() => Promise<void>) | null> {
	const fd = await fs.promises.open(filePath, "wx").catch(() => null);
	if (fd === null) {
		return null;
	}
	await fd.close();
	return async () => {
		await fs.promises.rm(filePath);
	};
}

export async function waitingForLockRelease(filePath: string): Promise<void> {
	if (!fs.existsSync(filePath)) {
		return;
	}
	const watchPromise = new Promise((resolve) => {
		const watcher = chokidar.watch(filePath, {
			persistent: false,
			ignoreInitial: true,
		});
		watcher
			.on("unlink", async () => {
				await watcher.close();
				resolve(null);
			})
			.on("error", async () => {
				await watcher.close();
				resolve(null);
			});
	});
	const timeoutPromise = delay(2 * 60 * 1000).then(() => {
		throw new Error("Lock file not released within 2 minutes");
	});
	await Promise.race([watchPromise, timeoutPromise]);
}
