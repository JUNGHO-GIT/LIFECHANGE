/**
 * @file UserAppInfo.tsx
 * @description foo
 * @author Jungho
 * @since 2026-07-02
 */

import { memo } from "@exportReacts";
import { useCommonValue } from "@exportHooks";
import { useStoreLanguage } from "@exportStores";
import { Img, Paper, Grid } from "@exportComponents";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppInfo = memo(() => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    TITLE,
    VERSION,
    MODE,
    localTimeZone,
    localLang,
    localIsoCode,
    localCurrency,
  } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 7. userAppInfo --------------------------------------------------------------------------------
  const userAppInfoNode = () => (
    <Paper className={`content-wrapper pt-5vh px-10px pb-10vh`}>
      <Grid container={true} spacing={2}>
        <Grid size={12} className={`d-center`}>
          <Img
            hover={true}
            shadow={false}
            radius={false}
            src={`logo1.webp`}
            className={`w-240px h-200px`}
          />
        </Grid>
        <Grid size={12}>
          <Grid container={true} spacing={2} className={`radius-2 border-light-1 shadow-0`}>
            <Grid size={12} className={`d-center`}>
              <TableContainer className={`over-hidden`}>
                <Table>
                  <TableBody className={`table-tbody`}>
                    <TableRow>
                      <TableCell className={`w-30vw fs-0-9rem p-15px`}>
                        {translate(`appInfo`)}
                      </TableCell>
                      <TableCell className={`w-65vw fs-0-7rem p-15px`}>
                        {TITLE}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={`w-30vw fs-0-9rem p-15px`}>
                        {`version`}
                      </TableCell>
                      <TableCell className={`w-65vw fs-0-7rem p-15px`}>
                        {VERSION}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={`w-30vw fs-0-9rem p-15px`}>
                        {`environment`}
                      </TableCell>
                      <TableCell className={`w-65vw fs-0-7rem p-15px`}>
                        {MODE}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={`w-30vw fs-0-9rem p-15px`}>
                        {`timezone`}
                      </TableCell>
                      <TableCell className={`w-65vw fs-0-7rem p-15px`}>
                        {localTimeZone}
                        {` | `}
                        {localLang}
                        {` | `}
                        {localIsoCode}
                        {` | `}
                        {localCurrency}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userAppInfoNode()}
    </>
  );
});
