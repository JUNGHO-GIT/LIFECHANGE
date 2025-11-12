// Delete.tsx

import { Div, Icons } from "@exportComponents";
import { memo, useCallback, useMemo } from "@exportReacts";

// -------------------------------------------------------------------------------------------------
declare type DeleteProps = {
	index: number;
	section?: string;
	handleDelete: (index: number, section?: string) => void;
	LOCKED?: string;
	disabled?: boolean;
}

// -------------------------------------------------------------------------------------------------
export const Delete = memo((
	{ index, section, handleDelete, LOCKED, disabled }: DeleteProps
) => {

	// 1. callbacks ----------------------------------------------------------------------------------
	const handleClick = useCallback(() => {
		if (disabled) {
			return;
		}
		handleDelete(index, section);
	}, [disabled, handleDelete, index, section]);

	// 2. deleteNode --------------------------------------------------------------------------------
	const deleteNode = useMemo(() => (
		<Div className={"mt-n10px mr-n10px"}>
			<Icons
				key={"X"}
				name={"X"}
				locked={LOCKED}
				className={"w-20px h-20px"}
				sx={{
					color: "var(--color-text-2)",
					"&:hover": {
						color: "var(--color-text-1)",
					},
				}}
				onClick={handleClick}
			/>
		</Div>
	), [LOCKED, handleClick]);

	// 10. return ------------------------------------------------------------------------------------
	return (
		<>
			{deleteNode}
		</>
	);
});