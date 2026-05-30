/**
 * @file Memo.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Grid, Img } from "@exportComponents";
import { Input, PopUp } from "@exportContainers";
import { useCommonValue as usCmmnVal } from "@exportHooks";
import { TextArea } from "@exportMuis";
import { memo, useCallback, useMemo } from "@exportReacts";
import { useStoreLanguage as usStrLang } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
declare interface MemoProps {
	OBJECT: any;
	setOBJECT: any;
	LOCKED: string;
	extra: string;
	i: number;
	section?: string;
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Memo = memo(
	({ OBJECT, setOBJECT, LOCKED, extra, i, section }: MemoProps) => {
		// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		const { firstStr } = usCmmnVal();
		const { translate } = usStrLang();
		const tgtSec: string = section ?? `${firstStr}_section`;

		// 2. callbacks ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		const hndlTxtChg = useCallback(
			(e: any) => {
				setOBJECT((prev: any) => ({
					...prev,
					[tgtSec]: prev[tgtSec]?.map(
						(section: any, idx: number) =>
							idx === i
								? {
										...section,
										[extra]: e.target.value ?? ``,
									}
								: section,
					),
				}));
			},
			[setOBJECT, tgtSec, i, extra],
		);

		// 3. memoized values ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
		const memoValue = useMemo(
			() => OBJECT?.[tgtSec]?.[i]?.[extra] ?? ``,
			[OBJECT, tgtSec, i, extra],
		);

		// 4. memoNode ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
		const memoNode = useMemo(
			() => (
				<PopUp
					type={`innerCenter`}
					position={`center`}
					direction={`center`}
					contents={
						<Grid
							container={true}
							spacing={3}
							columns={12}
							className={`w-max-70vw`}
						>
							<Grid size={12} className={`d-center`}>
								<TextArea
									className={`w-86vw h-55vh border-1 p-10px`}
									value={memoValue}
									style={{
										fontFamily: `inherit`,
										fontSize: `inherit`,
										fontWeight: `inherit`,
									}}
									onChange={hndlTxtChg}
								/>
							</Grid>
						</Grid>
					}
					children={(popTrigger: any) => (
						<Input
							label={translate(`memo`)}
							className={`pointer`}
							value={memoValue}
							readOnly={true}
							locked={LOCKED}
							startadornment={
								<Img
									max={14}
									hover={true}
									shadow={false}
									radius={false}
									src={`calendar3.webp`}
								/>
							}
							onClick={(e: any) => {
								popTrigger.openPopup(e.currentTarget);
							}}
						/>
					)}
				/>
			),
			[memoValue, hndlTxtChg, translate, LOCKED],
		);

		// 10. return ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
		return <>{memoNode}</>;
	},
);
