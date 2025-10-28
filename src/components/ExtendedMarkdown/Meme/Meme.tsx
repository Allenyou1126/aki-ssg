import { config } from "@/data/site-config";
import Image from "../../PostComponents/Image/Image";
import * as stylex from "@stylexjs/stylex";

const style = stylex.create({
	error: {
		color: "rgb(239 68 68)",
		display: "inline-block",
	},
});

export default async function Meme({
	group,
	mid,
}: {
	group: string;
	mid: string;
}) {
	if (config.optimize.meme_base_url === undefined) {
		return (
			<span {...stylex.props(style.error)}>
				[Meme: {group}/{mid}]
			</span>
		);
	}
	return (
		<Image
			src={`${config.optimize.meme_base_url}${group}/${mid}`}
			alt={`Meme: ${group}/${mid}`}
			inline
			scale={0.2}
		/>
	);
}
