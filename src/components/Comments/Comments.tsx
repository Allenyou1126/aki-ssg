"use client";
import dynamic from "next/dynamic";
import { config } from "@/data/site-config";
import React from "react";
import { CommentsLoading } from "./CommentsLoading";

const availableComments: Record<
	SiteConfig["comment"]["type"],
	() => Promise<React.FC>
> = {
	disable: async () =>
		import("@/components/Comments/NoComments") as unknown as React.FC,
	waline: async () =>
		import(
			"@/components/Comments/WalineComments/WalineComments"
		) as unknown as React.FC,
};

export const Comments = dynamic(availableComments[config.comment.type], {
	ssr: false,
	loading: () => {
		return <CommentsLoading />;
	},
});
