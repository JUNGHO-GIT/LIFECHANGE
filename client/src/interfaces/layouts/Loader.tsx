/**
 * @file Loader.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div } from "@exportComponents";
import { memo } from "@exportReacts";
import { useStoreLoading as usStrLoad } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Loader = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { LOADING } = usStrLoad();

	// 7.loader ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const loaderNode = () =>
		LOADING ? (
			<Div className={`loader-wrapper`}>
				<Div className={`loader`} />
			</Div>
		) : (
			<Div />
		);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return <>{loaderNode()}</>;
});
