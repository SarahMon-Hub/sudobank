var ChildWin;

function TransFromTWDate(sDate) {
	var iTemp;
	iTemp = sDate.indexOf('/');
	return Number(sDate.substr(0, iTemp)) + 1911 + sDate.substr(iTemp);
}

function TransToTWDate(sDate) {
	iDay = sDate.getDate();
	iMon = sDate.getMonth() + 1;
	iYea = sDate.getFullYear() - 1911;
	if (iDay < 10) iDay = '0' + iDay;
	if (iMon < 10) iMon = '0' + iMon;

	return iYea + '/' + iMon + '/' + iDay;
}

// ------------------------------
// 刪除字串前後空白後傳回
// ------------------------------
function PF_Trim(sString) {
	return sString.replace(/(^\s*)|(\s*$)/g, '');
}

// ------------------------------
// 將字串前填滿字元至足夠長度後傳回
// ------------------------------
function PF_LChar(sString, iLen, sChar) {
	sString = sString.toString();
	var iStringLen = sString.length;

	for (var i = 0; i < iLen - iStringLen; i++) {
		sString = sChar + sString;
	}

	return sString;
}

// ------------------------------
// 將字串後填滿字元至足夠長度後傳回
// ------------------------------
function PF_RChar(sString, iLen, sChar) {
	sString = sString.toString();
	var iStringLen = sString.length;

	for (var i = 0; i < iLen - iStringLen; i++) {
		sString = sString + sChar;
	}

	return sString;
}

// ------------------------------
// 日期檢核函數
// ------------------------------
function PF_IsDate(sString) {
	var dDate = new Date(sString);
	var sDate = dDate.getFullYear().toString() + '/' +
		PF_LChar(dDate.getMonth() + 1, 2, '0') + '/' +
		PF_LChar(dDate.getDate(), 2, '0');

	if (sDate == sString) {
		return true;
	}
	else {
		return false;
	}
}

// ------------------------------
// 數字檢核函數
// ------------------------------
function PF_IsNum(sString) {
	if (isNaN(sString)) {
		return false;
	}

	var re = /^\d*$/;
	return re.test(sString);
}

// ------------------------------
// 英文字母檢核函數
// ------------------------------
function PF_IsLetter(sString) {
	var re = /^[A-Za-z]*$/;
	return re.test(sString);
}

// ------------------------------
// 檢查UID
// 檢查本國人身分證號碼、統一編號、外國人(統一證號、護照號碼)
// ------------------------------
function PF_IsUid(strUid) {
	if (strUid.length < 8 || strUid.length == 9 || strUid.length > 10) {
		return false;
	}

	if (strUid.length == 8) {
		if (!PF_CheckBAN(strUid))						//統一編號
		{
			return false;
		}
	}
	else  //strUid.length == 10
	{
		if (PF_IsLetter(strUid.charAt(0).toUpperCase())) {
			switch (strUid.charAt(1)) {
				case '1':
				case '2':
					if (!PF_CheckID(strUid))			//本國人身分證號碼
					{
						return false;
					}
					break;

				case '8':
				case '9':
					if (!PF_CheckNewAlien(strUid))	//外國人(新式統一證號)
					{
						return false;
					}
					break;

				default:
					if (!PF_CheckAlien(strUid))		//外國人(統一證號)
					{
						return false;
					}
			}
		}
		else {
			if (!PF_CheckPassport(strUid))			//外國人(護照號碼)
			{
				return false;
			}
		}
	}

	return true;
}

// ------------------------------
// 本國人身分證號碼
// ------------------------------
function PF_CheckID(strUserID) {
	return PF_CheckLogic(strUserID, '1', '2', '本國人身分證號碼');
}

// ------------------------------
// 外國人ID(新式統一證號)
// ------------------------------
function PF_CheckNewAlien(strUserID) {
	return PF_CheckLogic(strUserID, '8', '9', '統一證號');
}

// ------------------------------
// 國民身分證號碼檢核邏輯
// ------------------------------
function PF_CheckLogic(strUserID, strMaleCode, strFemaleCode, strText) {
	var intAreaNo;				//區域碼變數
	var intCheckSum;			//檢核碼變數
	var intCount;				//計數變數
	var strAreaCode;			//區域碼變數
	// var blnCheckID = false;	//設定起始值

	strUserID = strUserID.toUpperCase();	//轉換為大寫
	strAreaCode = strUserID.charAt(0);		//取得首碼字母

	//確定身分證有10碼
	if (strUserID.length != 10) {
		strReason = strText + '必須是十碼';
		return false;
	}

	//確定首碼在A-Z之間
	if (strAreaCode < 'A' || strAreaCode > 'Z') {
		strReason = strText + '第一碼必須是英文字母';
		return false;
	}

	//確定第二碼是數字 1, 2, 8, 9	(1&8為男生, 2&9為女生)
	if (strUserID.charAt(1) != strMaleCode && strUserID.charAt(1) != strFemaleCode) {
		strReason = strText + '第二碼必須是' + strMaleCode + '(男生)或' + strFemaleCode + '(女生)';
		return false;
	}

	//確定3-10碼是數字
	if (!PF_IsNum(strUserID.substr(2, 8))) {
		strReason = strText + '第三碼至第十碼必須全部為數字';
		return false;
	}

	intAreaNo = 'ABCDEFGHJKLMNPQRSTUVXYWZIO'.indexOf(strAreaCode) + 10;				//取得英文字母對應編號，A=10,B=11等等
	strUserID = intAreaNo.toString() + strUserID.substr(1, 9);							//組合字串
	intCheckSum = parseInt(strUserID.charAt(0)) + parseInt(strUserID.charAt(10)); //計算首尾二者之和

	//計算第二碼至第十碼之積
	for (intCount = 1; intCount < 10; intCount++) {
		intCheckSum += parseInt(strUserID.charAt(intCount)) * (10 - intCount);
	}

	//檢查是否為10整除
	if ((intCheckSum % 10) == 0) {
		return true;
	}
	else {
		strReason = strText + '輸入錯誤，請再檢查';
		return false;
	}
}

// ------------------------------
// 統一編號
// ------------------------------
function PF_CheckBAN(strBAN) {
	var intMod;									//餘數變數
	var intSum;									//合計數變數
	var intX = new Array(1, 2, 1, 2, 1, 2, 4, 1);
	var intY = new Array(7);
	// var blnCheckBAN = false;
	var intCount;								//計數變數

	if (strBAN.length != 8) {
		strReason = '營利事業統一編號必須是八碼';
		return false;
	}

	if (!PF_IsNum(strBAN)) {
		strReason = '輸入之營利事業統一編號中有非數字';
		return false;
	}

	for (intCount = 0; intCount < 8; intCount++) {
		intX[intCount] *= parseInt(strBAN.charAt(intCount));
	}

	intY[0] = parseInt(intX[1] / 10);
	intY[1] = intX[1] % 10;
	intY[2] = parseInt(intX[3] / 10);
	intY[3] = intX[3] % 10;
	intY[4] = parseInt(intX[5] / 10);
	intY[5] = intX[5] % 10;
	intY[6] = parseInt(intX[6] / 10);	//相乘後的十位數
	intY[7] = intX[6] % 10;					//相乘後的個位數

	intSum = intX[0] + intX[2] + intX[4] + intX[7] + intY[0] + intY[1] + intY[2] + intY[3] + intY[4] + intY[5];

	//統一編號第7碼為7時，第7碼乘積相加取個位數
	if (strBAN.charAt(6) == '7') {
		intSum += (intY[6] + intY[7]) % 10;

		if ((intSum % 5) == 0) {
			return true;
		}
		else {
			intMod = (intSum + 1) % 5;
		}
	}
	else {
		intSum += intY[6] + intY[7];
		intMod = intSum % 5;
	}

	if (intMod == 0) {
		return true;
	}
	else {
		strReason = '營利事業統一編號輸入錯誤，請再檢查';
		return false;
	}
}

// ------------------------------
// 外國人ID(統一證號)
// ------------------------------
function PF_CheckAlien(strAlien) {
	var intAreaNo;					//區域碼變數
	var intSexNo;					//性別碼變數
	var intCheckSum;				//檢核碼變數
	var intCount;					//計數變數
	var strAreaCode;				//區域碼變數
	var strSexCode;				//性別碼
	// var blnCheckAlien = false;	//設定起始值

	strAlien = strAlien.toUpperCase();		//轉換為大寫
	strAreaCode = strAlien.charAt(0);		//取得區域碼字母
	strSexCode = strAlien.charAt(1);			//取得性別字母

	//確定統一證號有10碼
	if (strAlien.length != 10) {
		strReason = '統一證號必須是十碼';
		return false;
	}

	//確定第一碼在A-Z之間
	if (strAreaCode < 'A' || strAreaCode > 'Z') {
		strReason = '統一證號第一碼必須是英文字母';
		return false;
	}

	//確定第二碼在A-E之間
	if (strSexCode < 'A' || strSexCode > 'D') {
		strReason = '統一證號第二碼必須是介於A~D之間的英文字母';
		return false;
	}

	//確定3-10碼是數字
	if (!PF_IsNum(strAlien.substr(2, 8))) {
		strReason = '統一證號第三碼至第十碼必須全部為數字';
		return false;
	}

	intAreaNo = 'ABCDEFGHJKLMNPQRSTUVXYWZIO'.indexOf(strAreaCode) + 10;				//取得第一碼英文字母對應編號，A=10,B=11等等
	intSexNo = 'ABCD'.indexOf(strSexCode);														//取得第二碼英文字母對應編號，A=0,B=1等等
	strAlien = intAreaNo.toString() + intSexNo.toString() + strAlien.substr(2, 8);	//組合字串
	intCheckSum = parseInt(strAlien.charAt(0)) + parseInt(strAlien.charAt(10));	//計算首尾二者之和

	//計算第二碼至第十碼之積
	for (intCount = 1; intCount < 10; intCount++) {
		intCheckSum += parseInt(strAlien.charAt(intCount)) * (10 - intCount);
	}

	//檢查是否為10整除
	if ((intCheckSum % 10) == 0) {
		return true;
	}
	else {
		strReason = '統一證號輸入錯誤，請再檢查';
		return false;
	}
}

// ------------------------------
// 外國人ID(護照號碼)
// ------------------------------
function PF_CheckPassport(strPassport) {
	strPassport = strPassport.toUpperCase();	//轉換為大寫

	if (!PF_IsLetter(strPassport.substr(8, 2))) {
		//strReason = '護照號碼第九碼和第十碼必須是英文字母';
		strReason = '本國人身分證號碼輸入錯誤，請再檢查';
		return false;
	}

	if (!PF_IsNum(strPassport.substr(0, 8))) {
		//strReason = '護照號碼第一碼至第八碼必須全部為數字';
		strReason = '本國人身分證號碼輸入錯誤，請再檢查';
		return false;
	}

	if (!PF_IsDate(strPassport.substr(0, 4) + '/' + strPassport.substr(4, 2) + '/' + strPassport.substr(6, 2))) {
		//strReason = '護照號碼前八碼的格式必須為西元年月日';
		strReason = '本國人身分證號碼輸入錯誤，請再檢查';
		return false;
	}

	return true;
}

// ------------------------------
// eMail檢核函數
// ------------------------------
function PF_VerifyEMail(strEMail) {
	var re = /^([\w\-]+\.)*[\w\-]+@([\w\-]+\.)+[A-Za-z]{2,}$/;
	return re.test(strEMail);
}

// ------------------------------
// 手機檢核函數
// ------------------------------
function PF_VerifyMobile(strMobile) {
	var re = /^09\d{8}$/;
	return re.test(strMobile);
}

// ------------------------------
// 電話檢核函數
// ------------------------------
function PF_VerifyTel(strTel) {
	var re = /^\d{6,10}(#\d+)?$/;
	return re.test(strTel);
}

// ------------------------------
// 任職機構電話檢核函數
// ------------------------------
function PF_VerifyBizTel(strTel) {
	if (strTel.length > 20) {
		return false;
	}

	var re = /^\d{2,3}\-\d{6,8}(#\d{1,10})?$/;
	return re.test(strTel);
}

// ------------------------------
// 英文姓名檢核函數
// ------------------------------
function PF_VerifyUNameE(strUNameE) {
	var re = /^[A-Za-z,\- ]{0,35}$/;
	return re.test(strUNameE);
}
