////////////////////////////////////////////////////////////
// GAME
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

 //選取提示文字
var selectTextDisplay = '請選取 [NUMBER] 個號瑪'; //select number text display
var ballRadius = 60; //ball radius
var totalBall = 36; //total balls
var rotateBall = true; //rotate balls in 3d angle
var numberStartZero = false; //number start from zero instead of one

var spinDirection = true; //true for anticlockwise
var spinStartSpeed = 5; //spin starting speed
var spinEndSpeed = 5; //spin starting speed
var spinSpeed = 10; //spin speed
var revealTimer = 6; //reveal ball timer

var prizeTableDisplay = '預估獎項'; //score table text display
var numberTextDisplay = '上期頭獎號碼'; //your score text display
var matchTextDisplay = '對中 [NUMBER] 個號碼'; //match text display
var scoreTextDisplay = '[NUMBER]'; //prize score text display
var betgreat = '下注成功'; //prize score text display

//score points array and also the total number to reveal
var score_arr = ['loading', 'loading', 'loading', 'loading', 'loading'];

//特別號開關 true:開 false:關
var bonusBall = false; //toggle bonus ball
var bonusTextDisplay = 'MATCH [NUMBER] + BONUS'; //match bonus text display
//特別號
var bonusScore = [50000]; //bonus score point

var exitMessage = '是否確定\n要離開遊戲?'; //go to main page message
var betMessage = '請確認這組號碼是否正確?\n(投注一次10000魚骨幣)'; //下注訊息
var resultCompleteText = 'YOU WON [NUMBER]PTS!'; //result complete text display
var resultFailText = 'YOU DIDN\'T WIN!';  //result fail text display

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareText = 'SHARE THIS GAME'; //social share message
var shareTitle = 'Highscore on Lottery Numbers Game is [SCORE]PTS.';//social share score title
var shareMessage = '[SCORE]PTS is mine new highscore on Lottery Numbers Game! Try it now!'; //social share score message
				
/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */


var playerData = {score:0};
//buttonArray : 自動選號顯示 numberArray:全部號碼 selectArray:玩家選擇的號碼
var gameData = {paused:true, sphereX:400, sphereY:325, cageRadius:225, radius:0, spin:false, selectNum:0, numberNum:0, numberArray:[], selectArray:[], winArray:[], buttonArray:[], indexArray:[], dimArray:[], matchNum:0, ballsArray:[], cageArray:[], revealArray:[]};
var radiusTweenData = {radius:0};
var soundTweenData = {volume:0};

var betclick_b = false; // 開關獎池


/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	
	if($.browser.mobile || isTablet){
		
	}else{
		var isInIframe = (window.location != window.parent.location) ? true : false;
		if(isInIframe){
			$(window).blur(function() {
				appendFocusFrame();
			});
			appendFocusFrame();
        }
	}
	
	
	
   
    
	
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('game');
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonGoogle.cursor = "pointer";
	buttonGoogle.addEventListener("click", function(evt) {
		share('google');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		toggleConfirm(true);
	});
	
	buttonConfirm.cursor = "pointer";
    buttonConfirm.addEventListener("click", function (evt) {
        location.href = "http://" + location.host + "/Manage";
		/*toggleConfirm(false);
		stopGame();
		goPage('main');*/
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		toggleConfirm(false);
    });

    var url = "http://" + location.host + "/Html5/LottoBets";
    //下注確認鈕
    buttonBetConfirm.cursor = "pointer";
    buttonBetConfirm.addEventListener("click", function (evt) {
        toggleBet(false);
        $("#pgloading").css("display", "block");
        //betGreatContainer.visible = true;
        $.ajax({
            type: "POST",
            url: url,
            data: { Number: gameData.selectArray },
            success: function (data) {
                if (data != 0) {
                    console.log('下注成功');
                    getdata();
                    $("#pgloading").css("display", "none");

                    betGreatContainer.visible = true;
                } else {
                    $("#pgloading").css("display", "none");
                    alert('金錢不足');
                }
                

            }

        });
    });

    buttonBetGreatConfirm.cursor = "pointer";
    buttonBetGreatConfirm.addEventListener("click", function (evt) {
        betGreatContainer.visible = false;
           goPage('game');

    });
	
	//下注取消鈕
	buttonBetCancel.cursor = "pointer";
	buttonBetCancel.addEventListener("click", function(evt) {
		toggleBet(false);
	});
	
	buttonLucky.cursor = "pointer";
	buttonLucky.addEventListener("click", function(evt) {
        playSound('soundRandom');
		randomizeNumber();
    });

    backbuttonBet.cursor = "pointer";
    backbuttonBet.addEventListener("click", function (evt) {
        betRecordContainer.visible = false;
        buttonBetRecord.visible = true;
        buttonBet.visible = true;
        goPage('game');

    });

	

    buttonBetRecord.cursor = "pointer";
    buttonBetRecord.addEventListener("click", function (evt) {
        stratrecord(false, '投注記錄');



        
    });
	
	
	buttonBet.cursor = "pointer";
	buttonBet.addEventListener("click", function(evt) {
		//playSound('soundRandom')
		//toggleBet(true);
		shuffle(gameData.numberArray);
        setSelectBalls();
        console.log(gameData.selectArray.length);
        if (gameData.selectArray.length == 5) {
            toggleBet(true);//下注容器顯示
        } else {

            alert('請選擇5個號碼');
        }
		
		
		
		//betMoneyContainer.visible = true;//下注容器顯示
		
	});
	
	
	//txt.htmlElement.cursor = "pointer";
	/*bettxt.htmlElement.addEventListener("focus", function(evt) {
		//playSound('soundRandom')
		evt.target.value = "";
		
	});*/

    //獎項返回
    buttonSphereBack.cursor = "pointer";
    buttonSphereBack.addEventListener("click", function (evt) {
        /*PballsSelectContainer.visible = false;
        PreviousitemBarUser.visible = false;
        buttonSphereStart.visible = true;
        buttonLucky.visible = true;
        cardContainer.visible = true;
        tableContainer.visible = false;
        betclick_b = false;
        numberTitleTxt.visible = false;
        buttonBetRecord.visible = true;

        buttonSphereStart.visible = true;
        buttonSphereBack.visible = false;
        selectTitleTxt.text = selectTextDisplay;*/
        betRecordContainer.visible = false;
        buttonBetRecord.visible = true;
        buttonBet.visible = true;
        buttonSphereStart.visible = true;
        buttonSphereBack.visible = false;
        goPage('game');

        
        
    });


    //打開獎項
	buttonSphereStart.cursor = "pointer";
	buttonSphereStart.addEventListener("click", function(evt) {
		
		//startSpin(); //啟動抽獎
						
		/*if(!betclick_b)
		{*/
            stratrecord(true, prizeTableDisplay);
			buttonSphereStart.visible = true;
			buttonLucky.visible = false;
            cardContainer.visible = false;
            buttonBetRecord.visible = false;
			tableContainer.visible = true;
			betclick_b = true;
			PreviousitemBarUser.visible = true;
            PballsSelectContainer.visible = true;
            numberTitleTxt.visible = true;

            buttonSphereStart.visible = false;
            buttonSphereBack.visible = true;
			//var n = [0,1,2,3,4];
			
            PsetSelectBalls(pnumber);

            buttonBet.visible = true;
             getdata();
		/*}else{
			PballsSelectContainer.visible  = false;
			PreviousitemBarUser.visible = false;
			buttonSphereStart.visible = true;
			buttonLucky.visible = true;
			cardContainer.visible = true;
			tableContainer.visible = false;
            betclick_b = false;
            numberTitleTxt.visible = false;
            buttonBetRecord.visible = true;

            buttonSphereStart.visible = true;
            buttonSphereBack.visible = false;
			
		}*/
		
		
	});
	//textField.update();
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}


function stratrecord(con,text) {

    buttonLucky.visible = con;
    cardContainer.visible = con;
    buttonBetRecord.visible = con;
    betRecordContainer.visible = !con;
    buttonBet.visible = !con;


    //buttonSphereStart.visible = false;

    recordclick_b = !con;

    selectTitleTxt.text = text;


}




/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage = '';
function goPage(page){
	curPage=page;
	
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
		break;
		
		case 'game':			
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			
			if(gameData.matchNum != -1){
				playSound('soundComplete');
				resultTitleTxt.text = resultCompleteText.replace('[NUMBER]', addCommas(playerData.score));
				saveGame(playerData.score);
			}else{
				playSound('soundFail');
				resultTitleTxt.text = resultFailText;
				saveGame(0);
			}
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

function toggleConfirm(con){
	confirmContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true)
		gameData.paused = false;
	}
}

//下注單
function toggleBet(con){
	betMoneyContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true)
		gameData.paused = false;
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */

function startGame(){
	gameData.spin = false;
	gameData.selectArray = [];
	gameData.winArray = [];
	gameData.radius = 0;
	gameData.matchNum = -1;
	gameData.numberNum = 0;
	radiusTweenData.radius = 0;
	
	resetCard();
	shuffle(gameData.numberArray);
	shuffle(gameData.indexArray);
	
	for(var n=0; n<totalBall; n++){
		var targetIndex = gameData.indexArray[n];
		var targetBall = gameData.ballsArray[targetIndex].obj;
		targetBall.scaleX = targetBall.scaleY = .9;
		targetBall.x = randomIntFromInterval(gameData.sphereX-100,gameData.sphereX+100);
		targetBall.y = gameData.sphereY;
		ballsContainer.setChildIndex(targetBall, n);
	}
	resetBallsTimer();
	
	var extraBall = bonusBall == true ? 1 : 0;
	var totalNum = score_arr.length+extraBall;
	for(var n=1; n<totalNum;n++){
		$.prize['bg'+n] .alpha = 1;
		$.prize['bgselect'+n].alpha = 1;
		$.prize['text'+n].color = $.prize['score'+n].color = "#8d6d2c";
	}
	
	//gameData.revealArray = [12,25,10,3,5,15];
	
	//itemBarUser.visible = false;
	buttonSphereStart.visible = true;
	buttonLucky.visible = true;
	cardContainer.visible = true;
	tableContainer.visible = false;
    PreviousitemBarUser.visible = false;
    PballsSelectContainer.visible = false;
    buttonBetRecord.visible = true;
    buttonBet.visible = true;
	
	gameData.paused = false;
	setRevealBalls();
	playSoundLoop('soundBalls');
	setSoundVolume('soundBalls',0.1);
	playSoundLoop('soundCage');
	setSoundVolume('soundCage',0.1);
		
	selectTitleTxt.text = selectTextDisplay.replace('[NUMBER]', score_arr.length);
}

/*!
 * 
 * START SPIN - This is the function that runs to start spin
 開始抽獎
 * 
 */
function startSpin(number){
	gameData.selectArray = [];
	for(var n = 0; n<totalBall; n++){
		var targetNumber = gameData.buttonArray[n];
		if(targetNumber.highlight.visible){
			gameData.selectArray.push(n);	
		}
	}
	
	//if(gameData.selectArray.length == score_arr.length){
		//memberpayment
		/*if(typeof memberData != 'undefined'){
			if(!checkMemberGameType()){
				goMemberPage('user');
				return;
			}else{
				playerData.chance--;
				updateUserPoint();
			}
		}*/
		
		
		playSound('soundStartSpin');
		
		//itemBarUser.visible = true;
		buttonSphereStart.visible = false;
		buttonLucky.visible = false;
		cardContainer.visible = false;
        tableContainer.visible = true;
        numberTitleTxt.visible = false;
        PballsSelectContainer.visible = false;
        PreviousitemBarUser.visible = false;

        betRecordContainer.visible = false;
        buttonBetRecord.visible = false;
        buttonBet.visible = false;
        
		
		
		selectTitleTxt.text = prizeTableDisplay;
		
		//shuffle(gameData.numberArray);
		//setSelectBalls();
		gameData.spin = true;
		//gameData.numberArray = [0,1,2,3,4];
		/*if(gameData.revealArray.length == 0){
			var extraBall = bonusBall == true ? 1 : 0;
			for(var b = 0; b < score_arr.length+extraBall; b++){
				gameData.revealArray.push(gameData.numberArray[b]);
			}
		}*/
    //樂透號碼
        gameData.revealArray = number;
		TweenMax.to(radiusTweenData, spinStartSpeed, {radius:spinSpeed, overwrite:true, onComplete:beginWinNumberTimer});
        //TweenMax.to(radiusTweenData, spinStartSpeed, { radius: spinSpeed, overwrite: true});
		TweenMax.to(soundTweenData, spinStartSpeed, {volume:1, overwrite:true, onUpdate:updateBallsVolume});
	//}
}

function updateBallsVolume(){
	setSoundVolume('soundBalls', soundTweenData.volume);	
	setSoundVolume('soundCage', soundTweenData.volume);
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	stopSoundLoop('soundBalls');
	stopSoundLoop('soundCage');
	
	gameData.paused = true;
	gameData.spin = false;
	gameData.selectArray = [];
	gameData.winArray = [];
	gameData.revealArray = [];
	gameData.radius = 0;
	radiusTweenData.radius = 0;
	TweenMax.killAll();
	
	ballsSelectContainer.removeAllChildren();
	ballsRevealContainer.removeAllChildren();
}

/*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
function saveGame(score){
	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * READY GAME - This is the function that runs to setup card and physics
 * 
 */
function readyGame(){
	var startX = 707;
	var startY = 260;
	var currentX = startX;
	var currentY = startY;
	var spaceX = 65;
	var spaceY = 55;
	var countNum = 0;
	
	for(var n = 0; n<totalBall; n++){
		var newNumberBg = itemNumberBg.clone();
		var newNumberSelectBg = itemNumberSelectBg.clone();
		
		newNumberBg.x = currentX;
		newNumberBg.y = currentY;
		
		newNumberSelectBg.x = currentX;
		newNumberSelectBg.y = currentY;
		
		var newText = new createjs.Text();
		newText.font = "35px quantifybold";
		newText.color = "#000";
		newText.textAlign = "center";
		newText.textBaseline='alphabetic';
		if(numberStartZero){
			newText.text = pad(n,2);
		}else{
			newText.text = pad(n+1,2);	
		}
		newText.x = currentX;
		newText.y = currentY+11;
		
		newNumberBg.highlight = newNumberSelectBg;
		newNumberBg.text = newText;
		
		cardContainer.addChild(newNumberBg, newNumberSelectBg, newText);
		gameData.buttonArray.push(newNumberBg);
		
		newNumberBg.cursor = "pointer";
		newNumberBg.addEventListener("click", function(evt) {
			if(!gameData.spin){
				playSound('soundNumber')
				toggleNumber(evt.target);
				gameData.selectArray = [];
				for(var n = 0; n<totalBall; n++){
					var targetNumber = gameData.buttonArray[n];
					if(targetNumber.highlight.visible){
						gameData.selectArray.push(n);	
					}
				}
				
				console.log(gameData.selectArray);
				console.log(gameData.ballsArray);
				
			}
		});
		
		currentX += spaceX;
		
		countNum++;
		if(countNum > 5){
			countNum = 0;
			currentX = startX;
			currentY += spaceY;	
		}
	}
	
	for(var n=0; n<totalBall; n++){
		gameData.numberArray.push(n);
		gameData.indexArray.push(n);
		createBall(n);
	}
	
	itemBarBonus.visible = false;
	if(bonusBall){
		itemBar.visible = false;
		itemBarBonus.visible = true;	
	}
	
	createCages();
	createPhysics();
}

function toggleNumber(obj){
	if(!obj.highlight.visible){
		if(gameData.selectNum < score_arr.length){
			obj.highlight.visible = true;
			obj.text.color = "#fff";
			gameData.selectNum++;
		}
	}else{
		obj.highlight.visible = false;
		obj.text.color = "#000";
		gameData.selectNum--;
	}
}

/*!
 * 
 * RESET CARD - This is the function that runs to reset card
 * 
 */
function resetCard(){
	gameData.selectNum = 0;
	for(var n = 0; n<totalBall; n++){
		var targetNumber = gameData.buttonArray[n];
		targetNumber.highlight.visible = false;
		targetNumber.text.color = "#000";
	}	
}

/*!
 * 
 * RANDOMIZE NUMBERS - This is the function that runs to randomize numbers
 //自動選號
 * 
 */
function randomizeNumber(){
	resetCard();
    shuffle(gameData.numberArray);	
    gameData.selectArray = [];
	for(var n=0; n<score_arr.length; n++){
        toggleNumber(gameData.buttonArray[gameData.numberArray[n]]);	
        gameData.selectArray.push(gameData.buttonArray[gameData.numberArray[n]]);
    }
    gameData.selectArray = [];
    for (var n = 0; n < totalBall; n++) {
        var targetNumber = gameData.buttonArray[n];
        if (targetNumber.highlight.visible) {
            gameData.selectArray.push(n);
        }
    }
    console.log(gameData.selectArray);
      
}

/*!
 * 
 * LOOP UPDATE GAME - This is the function that runs to update game loop
 * 
 */

function updateGame(){
	spinCage();
	updatePhysics();
	
	if(spinDirection){
		gameData.radius -= radiusTweenData.radius;
		gameData.radius = gameData.radius < -360 ? 0 : gameData.radius;
	}else{
		gameData.radius += radiusTweenData.radius;
		gameData.radius = gameData.radius > 360 ? 0 : gameData.radius;		
	}
	itemStick.rotation = itemShine.rotation = gameData.radius;
}

/*!
 * 
 * CREATE BALL - This is the function that runs to create ball
 * 
 */
function createBall(number){
	
	var newBallContainer = new createjs.Container();
	var newBall = itemBallBg.clone();
	newBall.x = 0;
	newBall.y = 0;
	newBall.regX = 30;
	newBall.regY = 30;
	
	var newBallShadow = itemBallShadow.clone();
	newBallShadow.x = 0;
	newBallShadow.y = 0;
	
	var ballNumber;
	if(numberStartZero){
		ballNumber = pad(number,2);
	}else{
		ballNumber = pad(number+1,2);	
	}
	
	var space = 53;
	var newText = new createjs.Text();
	newText.font = "25px quantifybold";
	newText.color = "#000";
	newText.textAlign = "center";
	newText.textBaseline='alphabetic';
	newText.text = ballNumber;
	newText.x = 0;
	newText.y = 10;
	
	var newText2 = new createjs.Text();
	newText2.font = "25px quantifybold";
	newText2.color = "#000";
	newText2.textAlign = "center";
	newText2.textBaseline='alphabetic';
	newText2.text = ballNumber;
	newText2.x = space;
	newText2.y = 10;
	
	var newText3 = new createjs.Text();
	newText3.font = "25px quantifybold";
	newText3.color = "#000";
	newText3.textAlign = "center";
	newText3.textBaseline='alphabetic';
	newText3.text = ballNumber;
	newText3.x = 0;
	newText3.y = space+10;
	
	var newText4 = new createjs.Text();
	newText4.font = "25px quantifybold";
	newText4.color = "#000";
	newText4.textAlign = "center";
	newText4.textBaseline='alphabetic';
	newText4.text = ballNumber;
	newText4.x = space;
	newText4.y = space+10;
	
	var newBallInsideContainer = new createjs.Container();
	newBallInsideContainer.addChild(newBall, newText, newText2, newText3, newText4);
	
	var ballMask = new createjs.Shape();
	ballMask.graphics.beginFill('red').drawCircle(0,0,30);
	newBallInsideContainer.cache(-30, -30, 120, 120);
	newBallInsideContainer.mask = ballMask;
	
	newBallContainer.x = randomIntFromInterval(gameData.sphereX-150, gameData.sphereX+150);
	newBallContainer.y = gameData.sphereY;
	newBallContainer.addChild(newBallShadow, newBallInsideContainer);
	ballsContainer.addChild(newBallContainer);
	gameData.ballsArray.push({obj:newBallContainer, rotate:newBallInsideContainer});
}

function updateBallRotate(num, velX, velY, angle){
	if(!rotateBall){
		return;	
	}
	
	var targetBall = gameData.ballsArray[num].obj;
	var targetRotateBall = gameData.ballsArray[num].rotate;
	
	targetRotateBall.x += velX;
	targetRotateBall.y += velY;
	
	var end = -53;
	targetRotateBall.x = targetRotateBall.x > 0 ? end : targetRotateBall.x;
	targetRotateBall.x = targetRotateBall.x < end ? 0 : targetRotateBall.x;
	
	targetRotateBall.y = targetRotateBall.y > 0 ? end : targetRotateBall.y;
	targetRotateBall.y = targetRotateBall.y < end ? 0 : targetRotateBall.y;
}

function createCages(){
	var totalNum = 35;
	var wheelRadius = 360 / totalNum;
	
	for(var n=0; n<totalNum; n++){
		var currentRadius = wheelRadius * n;
		var newPos = getAnglePositionByValue(gameData.sphereX, gameData.sphereY, gameData.cageRadius, currentRadius);
		var newHit = itemBallHit.clone();
		newHit.x = newPos.x;
		newHit.y = newPos.y;
		newHit.radius = currentRadius;
		
		gameData.cageArray.push(newHit);
	}
}

function spinCage(){
	for(var n=0; n<gameData.cageArray.length; n++){
		var targetHit = gameData.cageArray[n];
		var newPos = getAnglePositionByValue(gameData.sphereX, gameData.sphereY, gameData.cageRadius, targetHit.radius+gameData.radius);
		targetHit.x = newPos.x;
		targetHit.y = newPos.y;
	}
}

/*!
 * 
 * WIN NUMBERS - This is the function that runs to reveal win numbers
 * 
 */
 
function beginWinNumberTimer(){
	TweenMax.to(ballsContainer, revealTimer, {overwrite:true, onComplete:revealWinNumber});	
}

function revealWinNumber(){
	var tweenNum = gameData.revealArray[gameData.numberNum];
	gameData.winArray.push(tweenNum);
	var targetBall = gameData.ballsArray[tweenNum].obj;
	var targetBallRotate = gameData.ballsArray[tweenNum].rotate;
	gameData.numberNum++;
	
	//ballsContainer.setChildIndex( targetBall, ballsContainer.getNumChildren()-1);
	
	playSound('soundSuck');
	TweenMax.to(targetBallRotate, .5, {x:0, y:0, rotation:0, overwrite:true});
	TweenMax.to(targetBall, .5, {x:gameData.sphereX, y:canvasH/100 * 71, rotation:0, scaleX:1, scaleY:1, overwrite:true, onComplete:function(){
		playSound('soundReveal');
		setRevealBalls();
		matchWinBalls();
		
		TweenMax.to(targetBall, .2, {delay:1, x:gameData.sphereX, y:canvasH/100 * 80, rotation:0, overwrite:true});
	}});
	
	var extraBall = bonusBall == true ? 1 : 0;
	if(gameData.numberNum < score_arr.length+extraBall){
		beginWinNumberTimer();
	}else{
		endGame();
	}
}

/*!
 * 
 * REVEAL BALLS - This is the function that runs to reveal balls
 * 
 */
function setRevealBalls(){
	ballsRevealContainer.removeAllChildren();
	
	var extraBall = bonusBall == true ? 1 : 0;
	var totalBalls = score_arr.length + extraBall;
	var totalSplit = Math.floor(totalBalls/2);
	var spaceX = 65;
	var startX = itemBar.x - (spaceX * totalSplit);
	
	if(isEven(totalBalls)){
		startX += spaceX/2;		
	}
	if(bonusBall){
		startX -= spaceX/5;	
	}
	var startY = itemBar.y-3;
	
	for(var n=0; n<score_arr.length; n++){
		if(n<gameData.winArray.length){
			var currentBallRotate = gameData.ballsArray[gameData.winArray[n]].rotate;
			currentBallRotate.x = currentBallRotate.y = 0;
			var newGuessBall = gameData.ballsArray[gameData.winArray[n]].obj.clone(true);
			newGuessBall.x = startX;
			newGuessBall.y = startY;	
		}else{
			var newGuessBall = itemBallGuess.clone();
			newGuessBall.x = startX;
			newGuessBall.y = startY;		
		}
		
		ballsRevealContainer.addChild(newGuessBall);
		startX += spaceX;
	}
	
	if(bonusBall){
		startX += spaceX/3;
		
		if(gameData.winArray.length > score_arr.length){
			var currentBallRotate = gameData.ballsArray[gameData.winArray[gameData.winArray.length-1]].rotate;
			currentBallRotate.x = currentBallRotate.y = 0;
			var newGuessBall = gameData.ballsArray[gameData.winArray[gameData.winArray.length-1]].obj.clone(true);
			newGuessBall.x = startX;
			newGuessBall.y = startY;		
		}
		//特別號
		/*else{
			var newGuessBall = itemBallBonus.clone();//
			newGuessBall.x = startX;
			newGuessBall.y = startY;	
		}*/
		
		ballsRevealContainer.addChild(newGuessBall);	
	}
}

/*!
 * 
 * SELECT BALLS - This is the function that runs to select balls
 * 
 */
function setSelectBalls(){
	ballsSelectContainer.removeAllChildren();
	gameData.dimArray = []
	
	var totalSplit = Math.floor(score_arr.length/2);
	var spaceX = 65;
	var startX = itemBarUser.x - (spaceX * totalSplit);
	if(isEven(score_arr.length)){
		startX += spaceX/2;		
	}
	var startY = itemBarUser.y-3;
	
	for(var n=0; n<gameData.selectArray.length; n++){
		var currentBallRotate = gameData.ballsArray[gameData.selectArray[n]].rotate;
		currentBallRotate.x = currentBallRotate.y = 0;
		var newGuessBall = gameData.ballsArray[gameData.selectArray[n]].obj.clone(true);
		newGuessBall.scaleX = newGuessBall.scaleY = 1;
		newGuessBall.x = startX;
		newGuessBall.y = startY;
		newGuessBall.rotation = 0;
		
		var newDimBall = itemBallDim.clone();
		newDimBall.x = startX;
		newDimBall.y = startY;
		newDimBall.active = true;
		gameData.dimArray.push(newDimBall);
		
		startX += spaceX;
		ballsSelectContainer.addChild(newGuessBall);
	}
}

/*!
 * 
 * SELECT BALLS - This is the function that runs to select balls
 上期頭獎號碼
 * 
 */
function PsetSelectBalls(number){
	
	PballsSelectContainer.removeAllChildren();
	gameData.dimArray = []
	
	var totalSplit = Math.floor(score_arr.length/2);
	var spaceX = 65;
	var startX = PreviousitemBarUser.x - (spaceX * totalSplit);
	if(isEven(score_arr.length)){
		startX += spaceX/2;		
	}
	var startY = PreviousitemBarUser.y-3;
	
	for(var n=0; n< number.length; n++){
		var currentBallRotate = gameData.ballsArray[number[n]].rotate;
		currentBallRotate.x = currentBallRotate.y = 0;
		var newGuessBall = gameData.ballsArray[number[n]].obj.clone(true);
		newGuessBall.scaleX = newGuessBall.scaleY = 1;
		newGuessBall.x = startX;
		newGuessBall.y = startY;
		newGuessBall.rotation = 0;
				
		startX += spaceX;
		PballsSelectContainer.addChild(newGuessBall);
	}
	console.log(PballsSelectContainer);
	
}

/*!
 * 
 * MATCH PRIZE - This is the function that runs to match prize
 * 
 */
function matchWinBalls(){
	var oldMatch = gameData.matchNum;
	for(var n=0; n<gameData.selectArray.length; n++){
		if(gameData.winArray.indexOf(gameData.selectArray[n]) != -1){
			if(gameData.dimArray[n].active){
				gameData.matchNum++;
				gameData.dimArray[n].active = false;
				animateHighlight(gameData.dimArray[n]);
			}
		}
	}
	
	if(oldMatch == gameData.matchNum){
		return;	
	}
	
	var extraBall = bonusBall == true ? 1 : 0;
	var totalMatchNum = score_arr.length+extraBall;
	totalMatchNum--;
	
	for(var n=0; n<score_arr.length;n++){
		if(gameData.matchNum == n){
			var targetNum = totalMatchNum - n;
			if(bonusBall && gameData.matchNum == (score_arr.length-1)){
				if(gameData.winArray.length > score_arr.length){
					//bonus
				}else{
					targetNum = 0;		
				}
			}
			TweenMax.to($.prize['bg'+targetNum], 1, {overwrite:true, onComplete:animatePrize, onCompleteParams:[targetNum]});
		}
	}
}

function animatePrize(num){
	var extraBall = bonusBall == true ? 1 : 0;
	for(var n=0; n<score_arr.length+extraBall;n++){
		$.prize['bg'+n].alpha = 1;
		$.prize['bgselect'+n].alpha = 1;
		$.prize['text'+n].color = $.prize['score'+n].color = "#8d6d2c";
	}
	
	playSound('soundWin');
	animateHighlight($.prize['bg'+num]);
	$.prize['text'+num].color = $.prize['score'+num].color = "#fff";	
	playerData.score = $.prize['score'+num].score;
}

/*!
 * 
 * ANIMATE HIGHLIGHT - This is the function that runs to animate highlight
 * 
 */
function animateHighlight(obj){
	TweenMax.to(obj, .1, {alpha:.2, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .1, {alpha:1, overwrite:true, onComplete:function(){
			TweenMax.to(obj, .1, {alpha:.2, overwrite:true, onComplete:function(){
				TweenMax.to(obj, .1, {alpha:1, overwrite:true, onComplete:function(){
					TweenMax.to(obj, .1, {alpha:0, overwrite:true, onComplete:function(){
		
					}});
				}});
			}});
		}});
	}});
}

/*!
 * 
 * END GAME - This is the function that runs to end game
 * 
 */
function endGame(){
	//memberpayment
	if(typeof memberData != 'undefined'){
		updateUserPoint();
    }

    //buttonSphereStart.visible = true;
    //buttonLucky.visible = true;
    //cardContainer.visible = true;
    //tableContainer.visible = false;


    //selectTitleTxt.text = '';
	
	TweenMax.to(radiusTweenData, spinEndSpeed, {radius:0, overwrite:true});
	TweenMax.to(soundTweenData, spinEndSpeed, {volume:.1, overwrite:true, onUpdate:updateBallsVolume});
		
	TweenMax.to(ballsContainer, 4, {overwrite:true, onComplete:function(){
		goPage('game');	
	}});	
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = shareTitle;
	var text = shareMessage;
	
	title = shareTitle.replace("[SCORE]", addCommas(playerData.score));
	text = shareMessage.replace("[SCORE]", addCommas(playerData.score));
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}
	
	window.open(shareurl);
}