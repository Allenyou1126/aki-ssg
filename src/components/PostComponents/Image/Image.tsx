import { JSX } from "react";
import ImageClient from "./ImageClient";
import probe from "probe-image-size";

export default async function Image(
	props: JSX.IntrinsicElements["img"] & {
		inline?: boolean;
		scale?: number;
		node?: unknown;
	}
) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { src, inline, scale: ori_scale, node, ...rest } = props;
	const scale = ori_scale ?? 1.0;
	if (
		!src ||
		typeof src != "string" ||
		src.startsWith("data:") ||
		src.startsWith("blob:")
	) {
		return <ImageClient {...props} />;
	}
	const result = await probe(src, {
		rejectUnauthorized: false,
	});
	return (
		<ImageClient
			{...rest}
			src={src}
			inline={inline}
			width={result.width * scale}
			height={result.height * scale}
		/>
	);
}
