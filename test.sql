SELECT A.*, B.jobViewCd, B.prdNm, B.unitProcNm, C.itemNm badTypeNm
FROM tblError A
LEFT JOIN(SELECT B1.*, B2.unitProcCd, B3.unitProcNm+'('+B4.procGroupNm+')' unitProcNm, B5.jobViewCd
FROM tblJobItems B1
INNER JOIN tblJobPlan B2 ON B1.jobCd = B2.jobCd AND B1.jobYear = B2.jobYear AND B1.prodCd = B2.prodCd
INNER JOIN (SELECT * FROM tblProcessUnit WHERE flagYN='Y') B3 ON B2.unitProcCd = B3.unitProcCd
INNER JOIN tblProcessGroup B4 ON B3.procGroupCd=B4.procGroupCd
INNER JOIN tblJobOrder B5 ON B1.jobCd = B5.jobCd AND  B1.jobYear = B5.jobYear
WHERE B1.flagYN='Y') B ON A.jobYear = B.jobYear AND A.jobCd = B.jobCd AND A.prodCd = B.prodCd AND A.unitProcCd = B.unitProcCd
LEFT JOIN (SELECT itemCd, itemNm FROM tblCommonCd WHERE groupCd='0043') C ON A.badType = C.itemCd
WHERE A.flagYN='Y' AND A.errorSeq IN(181,183,184,214,215,218)