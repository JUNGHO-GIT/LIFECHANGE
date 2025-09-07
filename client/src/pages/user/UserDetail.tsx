// UserDetail.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useValidateUser } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { axios } from "@importLibs";
import { sync, insertComma } from "@importScripts";
import { User } from "@importSchemas";
import { Footer } from "@importLayouts";
import { Input } from "@importContainers";
import { Hr, Img, Div, Paper, Grid } from "@importComponents";
import { Checkbox, Avatar } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const UserDetail = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, navigate, sessionId, localCurrency, localUnit } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();
  const { ERRORS, REFS, validate } = useValidateUser();

	// 2-2. useState -------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState(User);
  const [includingExclusions, setIncludingExclusions] = useState<boolean>(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId
      },
    })
    .then((res: any) => {
      setLOADING(false);
      setOBJECT(res.data.result || User);
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId]);

	// 3. flow ------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "detail", "")) {
      return;
    }
    axios.put(`${URL_OBJECT}/update`, {
      user_id: sessionId,
      OBJECT: OBJECT,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate("/user/detail");
        sync();
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 6. userDetail ---------------------------------------------------------------------------------
  const userDetailNode = () => {
    // 7-1. image
    const imageSection = () => (
      <Grid container={true} spacing={1}>
        <Grid size={12} className={"d-center"}>
          <Avatar
            src={OBJECT?.user_image}
            alt={"user_image"}
            className={"w-150px h-150px"}
          />
        </Grid>
      </Grid>
    );
    // 7-2. detail
    const detailSection = () => (
			<Grid container={true} spacing={0}>
				{[OBJECT]?.map((item, i) => (
					<Grid container={true} spacing={2} className={"p-10px"} key={`detail-${i}`}>
						{/** 이메일 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate("id")}
									value={item?.user_id}
								/>
							</Grid>
						</Grid>

						{/** 등록일 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate("regDt")}
									value={item?.user_regDt.split("T")[0]}
								/>
							</Grid>
						</Grid>

						<Hr m={1} className={"bg-light"} />

						{/** 최초 몸무게 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									label={translate("initScale")}
									value={insertComma(item.user_initScale || "0")}
									inputRef={REFS?.[i]?.user_initScale}
									error={ERRORS?.[i]?.user_initScale}
									startadornment={
										<Img
											max={12}
											hover={true}
											shadow={false}
											radius={false}
											src={"exercise5.webp"}
										/>
									}
									endadornment={
										localUnit
									}
									onChange={(e: any) => {
										// 빈값 처리
										let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
										// 999 제한 + 소수점 둘째 자리
										if (Number(value) > 999 || !/^\d*\.?\d{0,2}$/.test(value)) {
											return;
										}
										// 01, 05 같은 숫자는 1, 5로 변경
										if (/^0(?!\.)/.test(value)) {
											value = value.replace(/^0+/, '');
										}
										// object 설정
										setOBJECT((prev) => ({
											...prev,
											user_initScale: value,
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** 현재 몸무게 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate("curScale")}
									value={insertComma(item.user_curScale || "0")}
									startadornment={
										<Img
											max={12}
											hover={true}
											shadow={false}
											radius={false}
											src={"exercise5.webp"}
										/>
									}
									endadornment={
										localUnit
									}
								/>
							</Grid>
						</Grid>

						<Hr m={1} className={"bg-light"} />

						{/** 초기 평균 칼로리 섭취량 목표 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									label={translate("initAvgKcalIntake")}
									value={insertComma(item.user_initAvgKcalIntake || "0")}
									inputRef={REFS?.[i]?.user_initAvgKcalIntake}
									error={ERRORS?.[i]?.user_initAvgKcalIntake}
									startadornment={
										<Img
											max={12}
											hover={true}
											shadow={false}
											radius={false}
											src={"food2.webp"}
										/>
									}
									endadornment={
										translate("kc")
									}
									onChange={(e: any) => {
										// 빈값 처리
										let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
										// 9999 제한 + 정수
										if (Number(value) > 9999 || !/^\d+$/.test(value)) {
											return;
										}
										// 01, 05 같은 숫자는 1, 5로 변경
										if (/^0(?!\.)/.test(value)) {
											value = value.replace(/^0+/, '');
										}
										// object 설정
										setOBJECT((prev) => ({
											...prev,
											user_initAvgKcalIntake: value,
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** 현재 목표 칼로리 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate("curAvgKcalIntake")}
									value={insertComma(item.user_curAvgKcalIntake || "0")}
									startadornment={
										<Img
											max={12}
											hover={true}
											shadow={false}
											radius={false}
											src={"food2.webp"}
										/>
									}
									endadornment={
										translate("kc")
									}
								/>
							</Grid>
						</Grid>

						<Hr m={1} className={"bg-light"} />

						{/** 초기 자산 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									label={translate("initProperty")}
									value={insertComma(item.user_initProperty || "0")}
									inputRef={REFS?.[i]?.user_initProperty}
									error={ERRORS?.[i]?.user_initProperty}
									startadornment={
										<Img
											max={12}
											hover={true}
											shadow={false}
											radius={false}
											src={"money2.webp"}
										/>
									}
									endadornment={
										localCurrency
									}
									onChange={(e: any) => {
										// 빈값 처리
										let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
										// 9999999999 제한 + 정수
										if (Number(value) > 9999999999 || !/^\d+$/.test(value)) {
											return;
										}
										// 01, 05 같은 숫자는 1, 5로 변경
										if (/^0(?!\.)/.test(value)) {
											value = value.replace(/^0+/, '');
										}
										// object 설정
										setOBJECT((prev) => ({
											...prev,
											user_initProperty: value,
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** 현재 자산 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate("curPropertyExclusion")}
									value={
										includingExclusions ? (
											insertComma(item.user_curPropertyAll || "0")
										) : (
											insertComma(item.user_curPropertyExclusion || "0")
										)
									}
									startadornment={
										<Img
											max={12}
											hover={true}
											shadow={false}
											radius={false}
											src={"money2.webp"}
										/>
									}
									endadornment={
										localCurrency
									}
								/>
							</Grid>
						</Grid>

						{/** 포함 여부 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12} className={"d-row-left"}>
								<Div className={"fs-0-7rem fw-500 dark ml-10px"}>
									{translate("includingExclusions")}
								</Div>
								<Checkbox
									size={"small"}
									className={"p-0px ml-5px"}
									checked={includingExclusions}
									onChange={(e: any) => {
										setIncludingExclusions(e.target.checked);
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-75vh"}>
        {imageSection()}
        <Hr m={40} />
        {detailSection()}
      </Paper>
    );
  };

	// 9. footer ----------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        SEND
      }}
      setState={{
        setSEND
      }}
      flow={{
        flowSave
      }}
    />
  );

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {userDetailNode()}
      {footerNode()}
    </>
  );
};