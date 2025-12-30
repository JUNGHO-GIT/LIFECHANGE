/**
 * @file FoodFindService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { JSDOM } from "jsdom";
import axios from "axios";

// 1. list ---------------------------------------------------------------------------------------
export const list = async (
  PAGING_param: any,
  isoCode_param: string,
) => {

  // -----------------------------------------------------------------------------------------------
  const query: string = PAGING_param.query;
  const page: number = PAGING_param?.page;
  const isoCode: string = isoCode_param.toLowerCase();

  let serv: string = ``;
  let gram: string = ``;

  let findResult: any = null;
  let finalResult: any = [];
  let totalCntResult: any = null;
  let statusResult: string = ``;

  // -----------------------------------------------------------------------------------------------
  const getLangSettingsByIsoCode = (isoCodeParam: string) => {

    let langType: string = ``;
    let servUnit: string = ``;
    let servArray: string[] = [];
    let servRegex: RegExp = /(\s*)/;
    let nutritionRegex: RegExp = /(\s*)/;

    let URL: string = `https://www.fatsecret`;
    let URL_SEARCH: string = ``;
    const URL_DEFAULT: string = `https://www.fatsecret.com/calorias-nutricion/search`;

    const nationGroup: any = {
      ko: [`kr`],
      ja: [`jp`],
      zh: [ `cn`, `sg` ],
      es: [ `ar`, `cl`, `mx`, `es` ],
      pt: [ `br`, `pt` ],
      hi: [`in`],
      fr: [ `fr`, `be` ],
      it: [`it`],
      nl: [`nl`],
      pl: [`pl`],
      ru: [`ru`],
      tr: [`tr`],
      sv: [`se`],
      da: [`dk`],
      fi: [`fi`],
      en: [
        `ca`, `us`, `au`, `nz`, `uk`, `za`,
      ],
    };

    const isComGroup: any = [
      `ar`, `br`, `mx`, `au`, `sg`, `tr`,
    ];
    const isCoGroup: any = [ `in`, `id`, `nz`, `za`, `uk` ];
    const isDirectGroup: any = [
      `ca`, `cl`, `cn`, `kr`, `jp`, `de`, `at`, `be`, `dk`, `es`, `fi`, `fr`, `it`, `nl`, `pl`, `pt`, `ru`, `se`, `ch`,
    ];

    for (const [ languageCode, countries ] of Object.entries(nationGroup)) {
      if ((countries as string[]).includes(isoCodeParam)) {
        langType = languageCode;
        break;
      }
    }

    // com.foo 형식
    if (isComGroup.includes(isoCodeParam)) {
      URL = `${URL}.com.${isoCodeParam}`;
    }

    // co.foo 형식
    else if (isCoGroup.includes(isoCodeParam)) {
      URL = `${URL}.co.${isoCodeParam}`;
    }

    // foo 형식
    else if (isDirectGroup.includes(isoCodeParam)) {
      URL = `${URL}.${isoCodeParam}`;
    }

    // 그외
    else {
      URL = `${URL}.com`;
    }

    // 0. ko
    if (langType === `ko`) {
      URL_SEARCH = encodeURI(`${URL}/칼로리-영양소/search`);
      servUnit = `회`;
      servArray = [
        `개`,
        `회`,
        `알`,
        `통`,
        `봉`,
        `컵`,
        `팩`,
        `줄`,
        `장`,
        `마리`,
        `인분`,
        `봉지`,
        `한컵`,
        `대접`,
        `접시`,
        `소접시`,
        `테이블스푼`,
      ];
      servRegex = /(\s*)(\d+\s*.*\n*)(\s*당\s*)(\s*-\s*)/;
      nutritionRegex = /(\s*)(\s*칼로리\s*:\s*)(\d+\s*.*\n*)(kcal)(\s*\|\s*)(\s*지방\s*:\s*)(\d+\s*.*\n*)(g)(\s*\|\s*)(\s*탄수화물\s*:\s*)(\d+\s*.*\n*)(g)(\s*\|\s*)(\s*단백질\s*:\s*)(\d+\s*.*\n*)(g)/;
    }

    // 3. es
    else if (langType === `es`) {
      URL_SEARCH = encodeURI(`${URL}/calorías-nutrición/search`);
      servUnit = `porción`;
      servArray = [
        `porción`, `cucharada`, `pieza`, `rebanada`, `envase`, `paquete`, `tira`, `palo`, `barra`, `caja`, `paquete`, `botella`, `lata`, `tarro`, `sobre`, `tubo`, `eslabón`, `rollo`, `bandeja`, `tamaño de la porción`,
      ];
      servRegex = /(\s*)(\s*por\s*)(\d+\s*.*\n*)(\s*-\s*)/;
      nutritionRegex = /(\s*)(\s*Calorías\s*:\s*)(\d+\s*.*\n*)(kcal)(\s*\|\s*)(\s*Grasa\s*:\s*)(\d+\s*.*\n*)(g)(\s*\|\s*)(\s*Carbh\s*:\s*)(\d+\s*.*\n*)(g)(\s*\|\s*)(\s*Prot\s*:\s*)(\d+\s*.*\n*)(g)/;
    }

    // 99. en
    else {
      URL_SEARCH = encodeURI(`${URL}/calories-nutrition/search`);
      servUnit = `serving`;
      servArray = [
        `serving`,
        `scoop`,
        `piece`,
        `slice`,
        `container`,
        `packet`,
        `strip`,
        `stick`,
        `bar`,
        `box`,
        `package`,
        `bottle`,
        `can`,
        `jar`,
        `envelope`,
        `tube`,
        `link`,
        `roll`,
        `tray`,
        `serving size`,
      ];
      servRegex = /\s*(\s*Per\s*)(\d+\s*.*\n*)(\s*-\s*)/;
      nutritionRegex = /(\s*)(\s*Calories\s*:\s*)(\d+\s*.*\n*)(kcal)(\s*\|\s*)(\s*Fat\s*:\s*)(\d+\s*.*\n*)(g)(\s*\|\s*)(\s*Carbs\s*:\s*)(\d+\s*.*\n*)(g)(\s*\|\s*)(\s*Protein\s*:\s*)(\d+\s*.*\n*)(g)/;
    }

    return {
      URL: URL,
      URL_SEARCH: URL_SEARCH,
      URL_DEFAULT: URL_DEFAULT,
      servUnit: servUnit,
      servArray: servArray,
      servRegex: servRegex,
      nutritionRegex: nutritionRegex,
    };
  };

  // 전체 갯수 -------------------------------------------------------------------------------------
  const getTotalCnt = (document: any) => {

    const count: any = document.querySelector(`.searchResultSummary`)?.textContent;
    const countMatch: any = count?.match(/(\d+).*\s+(\d+).*\s+(\d+)/);

    // 가장 큰값 찾기
    const totalCnt: number = countMatch ? (
      Math.max(...countMatch.slice(1).map((el: string) => Number.parseInt(el)))
    ) : 0;

    return totalCnt;
  };

  // 음식 이름 -------------------------------------------------------------------------------------
  const getFoodName = (item: any) => {
    if (!item) {
      return ``;
    }
    const foodName: any = item.querySelector(`a.prominent`)?.textContent?.trim();

    return foodName;
  };

  // 브랜드 이름 -----------------------------------------------------------------------------------
  const getBrand = (item: any) => {
    if (!item) {
      return ``;
    }
    const brandName: string = item.querySelector(`a.brand`)?.textContent?.trim();

    // 1. 중첩괄호 처리
    const regex1: RegExp = /(\()(\s*)([\d !"'?A-Za-z가-힣]+)(\s*)(\([\d !"'?A-Za-z]+?\))(\))/;
    const match: RegExpMatchArray | null = brandName?.match(regex1);
    const firstResult: string = match ? match[3]?.trim() : brandName;

    // 2. 괄호 처리
    const regex2: RegExp = /(\()(\s*)([\d !"'?A-Za-z가-힣]+)(\s*)(\))/;
    const match2: RegExpMatchArray | null = firstResult?.match(regex2);
    const secondResult: string = match2 ? match2[3]?.trim() : firstResult;

    return secondResult;
  };

  // 영양정보 --------------------------------------------------------------------------------------
  const getServ = (item: any) => {

    const { servUnit, servArray, servRegex, nutritionRegex } = getLangSettingsByIsoCode(isoCode);
    const nutName: any = item.querySelector(`div.smallText.greyText.greyLink`)?.textContent?.trim();
    const servMatch: any = nutName?.match(servRegex);
    const nutritionMatch: any = nutName?.match(nutritionRegex);

    // 단위 찾기
    if (servMatch) {
      let found: boolean = false;
      // 1. servArray에 포함된 단어가 있는 경우
      servArray.forEach((el) => {
        if (servMatch[2]?.includes(el)) {
          const idx: any = servMatch[2]?.indexOf(el);
          const gramMatch: any = servMatch[2]?.slice(idx + el?.length).trim()?.match(/(\d+)\s*(g|ml|l|kg)/);
          serv = servMatch[2]?.slice(0, idx + el?.length).replace(/(\d+)\s+(.+)/, `$1$2`).trim();
          gram = gramMatch?.[1];
          found = true;
        }
      });

      // 2. servArray에 포함된 단어가 없는 경우
      if (!found) {
        const gramDirectMatch: any = servMatch[2]?.trim()?.match(/(\d+)\s*(g|ml|l|kg)/);
        if (gramDirectMatch) {
          serv = `1${servUnit}`;
          gram = gramDirectMatch[1];
        }
        else {
          const gramMatch: any = servMatch[2]?.trim()?.match(/(\d+)\s*(g|ml|l|kg)/);
          serv = servMatch?.[2]?.replace(/(\d+)\s+(.+)/, `$1$2`).trim();
          gram = gramMatch?.[1];
        }
      }
    }
    return {
      count: (serv?.match(/(\d+\.\d+|\d+)/) ?? [``])[0],
      serv: (serv?.match(/\D+$/) ?? [``])[0],
      gram: gram && gram,
      kcal: nutritionMatch?.[3],
      fat: nutritionMatch?.[7] && Number(nutritionMatch[7]).toFixed(1),
      carb: nutritionMatch?.[11] && Number(nutritionMatch[11]).toFixed(1),
      protein: nutritionMatch?.[15] && Number(nutritionMatch[15]).toFixed(1),
    };
  };

  // 음식 검색 -------------------------------------------------------------------------------------
  const getFoodList = async (URL: string, URL_DEFAULT: string, queryParam: string, pageParam: number) => {
    return new Promise((resolve, reject) => {
      axios.get(URL, {
        params: {
          q: queryParam,
          pg: pageParam,
        },
      })
      .then((res: any) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (error.response) {
          axios.get(URL_DEFAULT, {
            params: {
              q: queryParam,
              pg: pageParam,
            },
          })
          .then((res: any) => {
            resolve(res.data);
          })
          .catch((error) => {
            reject(error);
          });
        }
        else {
          reject(error);
        }
      });
    });
  };

  findResult = await getFoodList(
    getLangSettingsByIsoCode(isoCode).URL_SEARCH,
    getLangSettingsByIsoCode(isoCode).URL_DEFAULT,
    query,
    page,
  );
  const document: Document = new JSDOM(findResult).window.document;
  const totalCnt: number = getTotalCnt(document);

  if (!findResult) {
    finalResult = [];
    totalCntResult = 0;
    statusResult = `fail`;
  }
  else {
    const tables: NodeListOf<Element> = document.querySelectorAll(`table.generic.searchResult`);
    tables.forEach((param, tableIndex) => {
      const rows: NodeListOf<Element> = param.querySelectorAll(`tr`);
      [...rows].forEach((prev, rowIndex) => {
        const titleElement: any = getFoodName(prev);
        const brandElement: any = getBrand(prev);
        const nutritionElement: any = getServ(prev);
        finalResult.push({
          food_record_query: query,
          food_record_perNumber: page * 10 + tableIndex * rows?.length + rowIndex + 1,
          food_record_part: `breakfast`,
          food_record_name: titleElement ?? ``,
          food_record_brand: brandElement ?? ``,
          food_record_count: nutritionElement.count ?? `0`,
          food_record_serv: nutritionElement.serv ?? ``,
          food_record_gram: nutritionElement.gram ?? `0`,
          food_record_kcal: nutritionElement.kcal ?? `0`,
          food_record_fat: nutritionElement.fat ?? `0`,
          food_record_carb: nutritionElement.carb ?? `0`,
          food_record_protein: nutritionElement.protein ?? `0`,
        });
      });
    });
    totalCntResult = totalCnt;
    statusResult = `success`;
  }

  finalResult = finalResult.map((item: any) => ({
    ...item,
    food_record_key: `${item.food_record_name}_${item.food_record_brand}_${item.food_record_kcal}_${item.food_record_carb}_${item.food_record_protein}_${item.food_record_fat}`,
  }));

  return {
    status: statusResult,
    totalCnt: totalCntResult,
    result: finalResult,
  };
};
