import ImageClient from "./ImageClient";
import probe from "probe-image-size";

export default async function Image(props: JSX.IntrinsicElements["img"]) {
	const { src, ...rest } = props;
	if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
		return <ImageClient {...props} />;
	}
	const result = await probe(src, {
		rejectUnauthorized: false,
	});
	return (
		<ImageClient
			{...rest}
			src={src}
			width={result.width}
			height={result.height}
		/>
	);
}
