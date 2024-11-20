import PostListPage from "./post-list/[currentPage]/page";

export default async function Home() {
	return (
		<PostListPage
			params={
				new Promise((resolve) => {
					resolve({ currentPage: 1 });
				})
			}
		/>
	);
}
