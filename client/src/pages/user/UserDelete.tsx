// UserDelete.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useValidateUser } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { axios } from "@importLibs";
import { User } from "@importSchemas";
import { Input } from "@importContainers";
import { Div, Hr, Btn, Paper, Grid } from "@importComponents";

// -------------------------------------------------------------------------------------------------
export const UserDelete = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, navigate } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();
  const { ERRORS, REFS, validate } = useValidateUser();

	// 2-2. useState -------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState(User);

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    setTimeout(() => {
      setLOADING(false);
    }, 500);
  }, []);

	// 3. flow ------------------------------------------------------------------------------------
  const flowSendEmail = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "delete", "send")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/send`, {
      user_id: OBJECT.user_id,
      type: "delete"
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "success",
        });
        setOBJECT((prev) => ({
          ...prev,
          user_id_sended: true
        }));
      }
      else if (res.data.status === "notExist") {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
        setOBJECT((prev) => ({
          ...prev,
          user_id_sended: false
        }));
      }
      else if (res.data.status === "isGoogle") {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
        setOBJECT((prev) => ({
          ...prev,
          user_id_sended: false
        }));
      }
      else if (res.data.status === "fail") {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
        setOBJECT((prev) => ({
          ...prev,
          user_id_sended: false
        }));
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

	// 3. flow ------------------------------------------------------------------------------------
  const flowVerifyEmail = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "delete", "verify")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/verify`, {
      user_id: OBJECT.user_id,
      verify_code: OBJECT.user_verify_code
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "success",
        });
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: true
        }));
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: false
        }));
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

	// 3. flow ------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "delete", "save")) {
      setLOADING(false);
      return;
    }
    axios.delete(`${URL_OBJECT}/delete`,{
      data: {
        user_id: OBJECT.user_id,
        user_pw: OBJECT.user_pw,
      },
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate("/user/login");
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

  // 7. userResetPw --------------------------------------------------------------------------------
  const userResetPwNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Grid container={true} spacing={2}>
        <Grid size={12}>
          <Div className={"fs-1-8rem fw-500"}>
            {translate("userDelete")}
          </Div>
        </Grid>
      </Grid>
    );
    // 7-2. delete
    const deleteSection = () => (
			<Grid container={true} spacing={0}>
				{[OBJECT]?.map((item, i) => (
					<Grid container={true} spacing={2} className={"p-10px"} key={`detail-${i}`}>
						{/** 이메일 **/}
						<Grid container={true} spacing={1}>
							<Grid size={10}>
								<Input
									label={`${translate("id")}`}
									helperText={`* ${translate("helperId")}`}
									value={item.user_id}
									inputRef={REFS?.[i]?.user_id}
									error={ERRORS?.[i]?.user_id}
									disabled={item.user_id_verified === true}
									placeholder={"abcd@naver.com"}
									onChange={(e: any) => {
										const value = e.target.value;
										if (value?.length > 30) {
											setOBJECT((prev) => ({
												...prev,
												user_id: prev.user_id,
											}));
										}
										else {
											setOBJECT((prev) => ({
												...prev,
												user_id: value,
											}));
										}
									}}
								/>
							</Grid>
							<Grid size={2}>
								<Btn
									color={"primary"}
									className={"mt-n25px"}
									disabled={item.user_id_verified === true}
									onClick={() => {
										flowSendEmail();
									}}
								>
									{translate("send")}
								</Btn>
							</Grid>
						</Grid>

						{/** 이메일 인증 **/}
						<Grid container={true} spacing={1}>
							<Grid size={10}>
								<Input
									label={translate("verify")}
									helperText={`* ${translate("helperIdVerified")}`}
									value={item.user_verify_code}
									inputRef={REFS?.[i]?.user_id_verified}
									error={ERRORS?.[i]?.user_id_verified}
									disabled={item.user_id_verified === true}
									placeholder={"123456"}
									onChange={(e: any) => {
										setOBJECT((prev) => ({
											...prev,
											user_verify_code: e.target.value
										}))
									}}
								/>
							</Grid>
							<Grid size={2}>
								<Btn
									color={"primary"}
									className={"mt-n25px"}
									disabled={!item.user_id_sended || item.user_id_verified === true}
									onClick={() => {
										flowVerifyEmail();
									}}
								>
									{translate("verify")}
								</Btn>
							</Grid>
						</Grid>

						<Hr m={1} className={"bg-light"} />

						{/** 비밀번호 **/}
						<Grid container={true} spacing={1}>
							<Grid size={12}>
								<Input
									type={"password"}
									label={translate("pw")}
									helperText={`* ${translate("helperPw")}`}
									value={item.user_pw}
									inputRef={REFS?.[i]?.user_pw}
									error={ERRORS?.[i]?.user_pw}
									disabled={item.user_id_verified === false}
									onChange={(e: any) => {
										setOBJECT((prev) => ({
											...prev,
											user_pw: e.target.value
										}))
									}}
								/>
							</Grid>
						</Grid>

						{/** 비밀번호 확인 **/}
						<Grid container={true} spacing={1}>
							<Grid size={12}>
								<Input
									type={"password"}
									label={translate("pwVerified")}
									helperText={`* ${translate("helperPwVerified")}`}
									value={item.user_pw_verified}
									inputRef={REFS?.[i]?.user_pw_verified}
									error={ERRORS?.[i]?.user_pw_verified}
									disabled={item.user_id_verified === false}
									onChange={(e: any) => {
										setOBJECT((prev) => ({
											...prev,
											user_pw_verified: e.target.value
										}))
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
    // 7-4. button
    const buttonSection = () => (
      <Grid container={true} spacing={2}>
        <Grid size={12}>
          <Btn
            color={"error"}
            className={"w-100p fs-0-8rem"}
            onClick={() => {
              flowSave();
            }}
          >
            {translate("letsDelete")}
          </Btn>
        </Grid>
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center border-1 radius-2 shadow-1 h-min-100vh"}>
        {titleSection()}
        <Hr m={40} />
        {deleteSection()}
        <Hr m={30} className={"bg-light"} />
        {buttonSection()}
      </Paper>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {userResetPwNode()}
    </>
  );
};