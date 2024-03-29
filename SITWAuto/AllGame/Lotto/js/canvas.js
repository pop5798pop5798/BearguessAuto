////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.width = w;
	gameCanvas.height = h;
	
	canvasW=w;
	canvasH=h;
	

	
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);	
	
}

var guide = false;
var canvasContainer, mainContainer, gameContainer, confirmContainer, resultContainer, betContainer, betMoneyContainer, betGreatContainer, betRecordContainer;
var guideline, bg, logo, buttonStart, buttonContinue, buttonFacebook, buttonTwitter, buttonGoogle, buttonFullscreen, buttonSoundOn, buttonSoundOff;

$.prize = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	
	gameContainer = new createjs.Container();
	ballsContainer = new createjs.Container();
	ballsRevealContainer = new createjs.Container();
	ballsSelectContainer = new createjs.Container();
	PballsSelectContainer = new createjs.Container();
	cardContainer = new createjs.Container();
	tableContainer = new createjs.Container();
    confirmContainer = new createjs.Container();
    betRecordContainer = new createjs.Container();
    betMoneyContainer = new createjs.Container();
    betGreatContainer = new createjs.Container();
	betContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	starContainer = new createjs.Container();
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);
	buttonStart.x = canvasW/2;
	buttonStart.y = canvasH/100 * 77;
	
	
	
	
	//game
	itemBall = new createjs.Bitmap(loader.getResult('itemBall'));
	centerReg(itemBall);
	itemBall.x = -500;
	
	itemBallBg = new createjs.Bitmap(loader.getResult('itemBallBg'));
	centerReg(itemBallBg);
	itemBallBg.x = -500;
	
	itemBallShadow = new createjs.Bitmap(loader.getResult('itemBallShadow'));
	centerReg(itemBallShadow);
	itemBallShadow.x = -500;
	
	itemBallDim = new createjs.Bitmap(loader.getResult('itemBallDim'));
	centerReg(itemBallDim);
	itemBallDim.x = -500;
	
	itemBallGuess = new createjs.Bitmap(loader.getResult('itemBallGuess'));
	centerReg(itemBallGuess);
	itemBallGuess.x = -500;
	
	itemBallBonus = new createjs.Bitmap(loader.getResult('itemBallBonus'));
	centerReg(itemBallBonus);
	itemBallBonus.x = -500;
	
	itemBallHit = new createjs.Bitmap(loader.getResult('itemBallHit'));
	centerReg(itemBallHit);
	itemBallHit.x = -500;
	
	itemSphere = new createjs.Bitmap(loader.getResult('itemSphere'));
	centerReg(itemSphere);
	itemStick = new createjs.Bitmap(loader.getResult('itemStick'));
	centerReg(itemStick);
	itemShine = new createjs.Bitmap(loader.getResult('itemShine'));
	centerReg(itemShine);
	
	itemSphere.x = gameData.sphereX;
	itemSphere.y = gameData.sphereY + 25;
	itemStick.x = gameData.sphereX;
	itemStick.y = gameData.sphereY;
	itemShine.x = gameData.sphereX;
	itemShine.y = gameData.sphereY;
	
	itemBar = new createjs.Bitmap(loader.getResult('itemBar'));
	centerReg(itemBar);
	itemBar.x = gameData.sphereX;
	itemBar.y = canvasH/100 * 81;
	
	itemBarBonus = new createjs.Bitmap(loader.getResult('itemBarBonus'));
	centerReg(itemBarBonus);
	itemBarBonus.x = gameData.sphereX;
	itemBarBonus.y = canvasH/100 * 81;

    //獎項&近期頭獎
	buttonSphereStart = new createjs.Bitmap(loader.getResult('buttonSphereStart'));
	centerReg(buttonSphereStart);
	buttonSphereStart.x = gameData.sphereX;
    buttonSphereStart.y = gameData.sphereY;

    //近期頭獎返回
    buttonSphereBack = new createjs.Bitmap(loader.getResult('Bback'));
    centerReg(buttonSphereBack);
    buttonSphereBack.x = gameData.sphereX;
    buttonSphereBack.y = gameData.sphereY;
	
	
	itemCard = new createjs.Bitmap(loader.getResult('itemCard'));
	centerReg(itemCard);
	itemCard.x = canvasW/100 * 68;
	itemCard.y = canvasH/100 * 51;
	
	
	//個人下注號碼確認
	itemBarUser = new createjs.Bitmap(loader.getResult('itemBar'));
	centerReg(itemBarUser);
	itemBarUser.x = canvasW/100 * 50;
	itemBarUser.y = canvasH/100 * 54;
	
	buttonLucky = new createjs.Bitmap(loader.getResult('buttonLucky'));
	centerReg(buttonLucky);
	buttonLucky.x = itemCard.x - 150;
	buttonLucky.y = canvasH/100 * 81;
	buttonLucky.scaleX = 0.5;
	buttonLucky.scaleY = 0.5;
	//buttonLucky.width = 100px;
	//buttonLucky.height = 100px;
	
	//下注按鈕
	buttonBet = new createjs.Bitmap(loader.getResult('buttonBet'));
	centerReg(buttonBet);
	buttonBet.x = itemCard.x + 10;
	buttonBet.y = canvasH/100 * 81;
	buttonBet.scaleX = 0.5;
    buttonBet.scaleY = 0.5;

    //返回按鈕
    backbuttonBet = new createjs.Bitmap(loader.getResult('buttonBack'));
    centerReg(backbuttonBet);
    backbuttonBet.x = itemCard.x + 10;
    backbuttonBet.y = canvasH / 100 * 81;
    backbuttonBet.scaleX = 0.5;
    backbuttonBet.scaleY = 0.5;

    //下注記錄按鈕
    buttonBetRecord = new createjs.Bitmap(loader.getResult('buttonBetRecord'));
    centerReg(buttonBetRecord);
    buttonBetRecord.x = itemCard.x + 150;
    buttonBetRecord.y = canvasH / 100 * 81;
    buttonBetRecord.scaleX = 0.5;
    buttonBetRecord.scaleY = 0.5;
	
	
	
	
	itemNumberBg = new createjs.Bitmap(loader.getResult('itemNumberBg'));
	centerReg(itemNumberBg);
	itemNumberSelectBg = new createjs.Bitmap(loader.getResult('itemNumberSelectBg'));
	centerReg(itemNumberSelectBg);
	itemNumberBg.x = -500;
	itemNumberSelectBg.x = -500;
		
	
	itemTable = new createjs.Bitmap(loader.getResult('itemTable'));
	centerReg(itemTable);
	itemTable.x = itemCard.x;
	itemTable.y = canvasH/100 * 48;
	
	selectTitleTxt = new createjs.Text();
	selectTitleTxt.font = "35px quantifybold";
	selectTitleTxt.color = "#deb868";
	selectTitleTxt.textAlign = "center";
	selectTitleTxt.textBaseline='alphabetic';
	selectTitleTxt.text = 'STAGE 1 COMPLETE';
    selectTitleTxt.x = itemCard.x;
	selectTitleTxt.y = canvasH/100 * 28;
	
	numberTitleTxt = new createjs.Text();
	numberTitleTxt.font = "35px quantifybold";
	numberTitleTxt.color = "#deb868";
	numberTitleTxt.textAlign = "center";
	numberTitleTxt.textBaseline='alphabetic';
	numberTitleTxt.text = numberTextDisplay;
	numberTitleTxt.x = itemCard.x;
	numberTitleTxt.y = canvasH/100 * 74;
	
	var startX = itemCard.x;
	var startY = canvasH/100 * 32;
	var spaceY = 43;
	
	var extraBall = bonusBall == true ? 1 : 0;
	var totalNum = score_arr.length+extraBall;
	
	for(var n=1; n<score_arr.length+extraBall;n++){
		$.prize['bg'+n] = new createjs.Bitmap(loader.getResult('itemPrizeBg'));
		centerReg($.prize['bg'+n]);
		$.prize['bg'+n].x = startX;
		$.prize['bg'+n].y = startY;
		
		$.prize['bgselect'+n] = new createjs.Bitmap(loader.getResult('itemPrizeSelectBg'));
		centerReg($.prize['bgselect'+n]);
		$.prize['bgselect'+n].x = startX;
		$.prize['bgselect'+n].y = startY;
		
		$.prize['text'+n] = new createjs.Text();
		$.prize['text'+n].font = "25px quantifybold";
		$.prize['text'+n].color = "#8d6d2c";
		$.prize['text'+n].textAlign = "left";
		$.prize['text'+n].textBaseline='alphabetic';
		$.prize['text'+n].x = itemCard.x - 180;
		$.prize['text'+n].y = startY+10;
		
		$.prize['score'+n] = new createjs.Text();
		$.prize['score'+n].font = "28px quantifybold";
		$.prize['score'+n].color = "#8d6d2c";
		$.prize['score'+n].textAlign = "right";
		$.prize['score'+n].textBaseline='alphabetic';
		$.prize['score'+n].x = itemCard.x + 180;
		$.prize['score'+n].y = startY+10;
		
		var textString = '';
		var scoreString = '';
		var scoreNum = score_arr[totalNum-1];
		
		if(bonusBall){
			if(n == 0){
				totalNum--;	
				textString = matchTextDisplay.replace('[NUMBER]', totalNum);
				scoreString = scoreTextDisplay.replace('[NUMBER]', addCommas(score_arr[totalNum-1]));
			}
			//特別號
			/*else if(n == 1){
				textString = bonusTextDisplay.replace('[NUMBER]', totalNum);
				scoreString = scoreTextDisplay.replace('[NUMBER]', addCommas(bonusScore[0]));
				scoreNum = bonusScore[0];
				totalNum++;
			}*/
			else{
				textString = matchTextDisplay.replace('[NUMBER]', totalNum);
				scoreString = scoreTextDisplay.replace('[NUMBER]', addCommas(score_arr[totalNum-1]));
			}
		}else{
			textString = matchTextDisplay.replace('[NUMBER]', totalNum);
			scoreString = scoreTextDisplay.replace('[NUMBER]', addCommas(score_arr[totalNum-1]));
		}
		
		$.prize['text'+n].text = textString;
		$.prize['score'+n].text = scoreString;
		$.prize['score'+n].score = scoreNum;
		
		totalNum--;
		startY += spaceY;
		
		tableContainer.addChild($.prize['bgselect'+n], $.prize['bg'+n], $.prize['text'+n], $.prize['score'+n]);
	}
	
	tableContainer.addChild(numberTitleTxt);
	
	//result
	itemResult = new createjs.Bitmap(loader.getResult('itemResult'));
	
	resultTitleTxt = new createjs.Text();
	resultTitleTxt.font = "50px quantifybold";
	resultTitleTxt.color = "#ddb867";
	resultTitleTxt.textAlign = "center";
	resultTitleTxt.textBaseline='alphabetic';
	resultTitleTxt.text = 'STAGE 1 COMPLETE';
	resultTitleTxt.x = canvasW/2;
	resultTitleTxt.y = canvasH/100 * 45;
	
	resultShareTxt = new createjs.Text();
	resultShareTxt.font = "30px quantifybold";
	resultShareTxt.color = "#8e6c2b";
	resultShareTxt.textAlign = "center";
	resultShareTxt.textBaseline='alphabetic';
	resultShareTxt.text = shareText;
	resultShareTxt.x = canvasW/2;
	resultShareTxt.y = canvasH/100 * 52;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	buttonGoogle = new createjs.Bitmap(loader.getResult('buttonGoogle'));
	centerReg(buttonFacebook);
	createHitarea(buttonFacebook);
	centerReg(buttonTwitter);
	createHitarea(buttonTwitter);
	centerReg(buttonGoogle);
	createHitarea(buttonGoogle);
	buttonFacebook.x = canvasW/100 * 45;
	buttonTwitter.x = canvasW/2;
	buttonGoogle.x = canvasW/100 * 55;
	buttonFacebook.y = buttonTwitter.y = buttonGoogle.y = canvasH/100*58;
	
	buttonContinue = new createjs.Bitmap(loader.getResult('buttonContinue'));
	centerReg(buttonContinue);
	createHitarea(buttonContinue);
	buttonContinue.x = canvasW/2;
	buttonContinue.y = canvasH/100 * 70;
	
	//option
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonExit);
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	//下注確認背景
    itemBetConfirm = new createjs.Bitmap(loader.getResult('itemExit'));

    //下注成功背景
    itemBetGreatConfirm = new createjs.Bitmap(loader.getResult('itemExit'));
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	buttonConfirm.x = canvasW/100* 39;
	buttonConfirm.y = canvasH/100 * 67;
	
	//下注確認鈕
	buttonBetConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonBetConfirm);
	buttonBetConfirm.x = canvasW/100* 39;
	buttonBetConfirm.y = canvasH/100 * 67;
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	buttonCancel.x = canvasW/100 * 61;
	buttonCancel.y = canvasH/100 * 67;
	
	//下注取消鈕
	buttonBetCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonBetCancel);
	buttonBetCancel.x = canvasW/100 * 61;
    buttonBetCancel.y = canvasH / 100 * 67;

    //下注成功
    buttonBetGreatConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
    centerReg(buttonBetGreatConfirm);
    buttonBetGreatConfirm.x = canvasW / 100 * 51;
    buttonBetGreatConfirm.y = canvasH / 100 * 67;
	
	//上期頭獎
	PreviousitemBarUser = new createjs.Bitmap(loader.getResult('itemBar'));
	centerReg(PreviousitemBarUser);
	PreviousitemBarUser.x = itemCard.x;
	PreviousitemBarUser.y = canvasH/100 * 84;
	
	confirmMessageTxt = new createjs.Text();
	confirmMessageTxt.font = "40px quantifybold";
	confirmMessageTxt.color = "#ddb867";
	confirmMessageTxt.textAlign = "center";
	confirmMessageTxt.textBaseline='alphabetic';
	confirmMessageTxt.text = exitMessage;
	confirmMessageTxt.lineHeight = 40;
	confirmMessageTxt.x = canvasW/2;
	confirmMessageTxt.y = canvasH/100 *47;
	
	betConfirmMessageTxt = new createjs.Text();
	betConfirmMessageTxt.font = "40px quantifybold";
	betConfirmMessageTxt.color = "#ddb867";
	betConfirmMessageTxt.textAlign = "center";
	betConfirmMessageTxt.textBaseline='alphabetic';
	betConfirmMessageTxt.text = betMessage;
	betConfirmMessageTxt.lineHeight = 40;
	betConfirmMessageTxt.x = canvasW/2;
    betConfirmMessageTxt.y = canvasH / 100 * 40;

    betGreatMessageTxt = new createjs.Text();
    betGreatMessageTxt.font = "40px quantifybold";
    betGreatMessageTxt.color = "#ddb867";
    betGreatMessageTxt.textAlign = "center";
    betGreatMessageTxt.textBaseline = 'alphabetic';
    betGreatMessageTxt.text = betgreat;
    betGreatMessageTxt.lineHeight = 40;
    betGreatMessageTxt.x = canvasW / 2;
    betGreatMessageTxt.y = canvasH / 100 * 40;
	
	
	/*betTxt = new createjs.Text();
	betTxt.font = "40px quantifybold";
	betTxt.color = "#ddb867";
	betTxt.textAlign = "center";
	betTxt.textBaseline='alphabetic';
	betTxt.text = '請輸入投注額(最低10,000)';
	betTxt.lineHeight = 40;
	betTxt.x = canvasW/2;
	betTxt.y = canvasH/100 *47;*/


    

    buttonSphereBack.visible = false;

    
    betRecordContainer.addChild(backbuttonBet);
    betRecordContainer.visible = false;

   
   
	
	confirmContainer.addChild(itemExit, buttonConfirm, buttonCancel, confirmMessageTxt);
	confirmContainer.visible = false;
	
    betMoneyContainer.addChild(itemBetConfirm, buttonBetConfirm, buttonBetCancel, itemBarUser, ballsSelectContainer, betConfirmMessageTxt);
	//buttonBetConfirm,buttonBetCancel,betConfirmMessageTxt,
    betMoneyContainer.visible = false;

    betGreatContainer.addChild(itemBetGreatConfirm, buttonBetGreatConfirm, betGreatMessageTxt);
    betGreatContainer.visible = false;

	
	if(guide){
		guideline = new createjs.Shape();
		guideline.graphics.setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
	}
	
	mainContainer.addChild(logo, buttonStart);
	
    gameContainer.addChild(itemBallBg, itemBallShadow, itemBall, itemBallDim, itemBallGuess, itemBallBonus, itemBallHit, itemNumberBg, itemNumberSelectBg, ballsContainer, itemStick, itemSphere, itemShine, buttonSphereStart, buttonSphereBack, itemBar, itemBarBonus, ballsRevealContainer, itemCard, buttonLucky, cardContainer, tableContainer, selectTitleTxt, buttonBet, PreviousitemBarUser, PballsSelectContainer, buttonBetRecord );//遊戲開始讀取全部圖檔
	
	resultContainer.addChild(itemResult, resultTitleTxt, buttonContinue);
	
	if(shareEnable){
		resultContainer.addChild(resultShareTxt, buttonFacebook, buttonTwitter, buttonGoogle);
	}
	
    canvasContainer.addChild(bg, mainContainer, gameContainer, resultContainer, confirmContainer, betContainer, buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonExit, guideline, betMoneyContainer, betGreatContainer,betRecordContainer);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
	
	
	
	
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		if(curPage == 'main'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = canvasW - offset.x;
			buttonSoundOn.y = buttonSoundOff.y = offset.y;
			buttonSoundOn.x = buttonSoundOff.x -= 40;
			buttonSoundOn.y = buttonSoundOff.y += 35;
			
			buttonFullscreen.x = buttonSoundOn.x-60;
			buttonFullscreen.y = buttonSoundOn.y;
		}else{
			buttonExit.visible = true;
			buttonExit.x = (canvasW - offset.x) - 40;
			buttonExit.y = offset.y + 35;
			buttonSoundOn.x = buttonSoundOff.x = buttonExit.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonExit.y;
			buttonSoundOn.x = buttonSoundOff.x = buttonExit.x - 60;
			buttonSoundOn.y = buttonSoundOff.y = buttonExit.y;
			
			buttonFullscreen.x = buttonSoundOn.x - 60;
			buttonFullscreen.y = buttonSoundOn.y;	
		}
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));
}