declare type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

declare type StyleProps = {
	first?: boolean;
	last?: boolean;
	parent?: string;
};
