    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        window.location.href = "mobile.html";
        isMobile = true;
    }else{
        isMobile = false;
    }

    var socket = io();

$('#send').click(function(){

    $('.main_form').hide();
    var secret = $('#secret').val();

    socket.on('action_btn_data', function(data){
        console.log(data.action_btn);
        console.log(data.key);
        if(secret == data.key){
            action_btn = data.action_btn;
            if(action_btn == "up_key"){
                Player.body.velocity.y = -500;
                setTimeout(function(){
                    Player.body.velocity.y = 0;
                },200);
            }else if(action_btn == "down_key"){
                Player.body.velocity.y = +500;
                setTimeout(function(){
                    Player.body.velocity.y = 0;
                },200);
            }else if(action_btn == "fire_1"){
                FireAbility(1);
            }else if(action_btn == "fire_2"){
                FireAbility(2);
            }else if(action_btn == "fire_3"){

            }else if(action_btn == "water_1"){

            }else if(action_btn == "water_2"){

            }else if(action_btn == "water_3"){

            }
        }
    });

    // This function will send power status back to your phone when user collects fire or ice stone
    // The status can be fire_2 or fire_3 or water_2 or water_3
    function sendPowerStatus(action_status){
        socket.emit('action_btn_status', {
            action_status: action_status,
            key: secret
        });
    }


    gameWidth = 1000;
    gameHeight = 600;

    var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, 'game', {
      preload: preload,
      create: create,
      update: update
    });

    WebFontConfig = {

        //  'active' means all requested fonts have finished loading
        //  We set a 1 second delay before calling 'createText'.
        //  For some reason if we don't the browser cannot render the text the first time it's created.
        // active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

        //  The Google Fonts we want to load (specify as many as you like in the array)
        google: {
          families: ['Press Start 2P']
        }
    }

    var gameInProgress = false;
    var firstLine;
    var secondLine;
    var thirsLine;
    var fourthLine;
    var upKey;
    var downKey;
    var playerHit = 0;
    var fireStoneNum = 0;
    var waterStoneNum = 0;
    var FireBallTime = 0;

    var pavan;


    function preload(){
        game.load.audio('backgroundMusic', ['Assets/BackgroundMusic.wav', 'Assets/BackgroundMusic.ogg']);
        game.load.image('Background1', 'Assets/bg1.png?v=sddasdaasda');
        game.load.image('Background2', 'Assets/bg2.png?v=sddsda');
        game.load.image('Background3', 'Assets/bg3.png?v=sdda');
        game.load.image('Background4', 'Assets/bg4.png?v=sddasda');
        game.load.image('Empty', 'Assets/Empty.png?v=sa');
        game.load.atlas('Shruti', 'Assets/CharacterSpriteSheet.png?v=ssdaa','Assets/sprites.json?v=nonoinm'); 
        game.load.atlas('FlyingEnemy', 'Assets/FlyingEnemySpriteSheet.png?v=ssdsdsdxkldaa','Assets/spritesFly.json?v=nonoinsdam'); 
        game.load.atlas('Powers', 'Assets/PowersSpriteSheet.png?v=ssdsdsdxmlijnkldaa','Assets/PowerSprites.json?v=nfwqonoinsdam'); 
        game.load.atlas('fireStone', 'Assets/FireStone.png?v=ssdsdsdxmlijnklsadaa','Assets/spritesFireStone.json?v=sdafg'); 
        game.load.atlas('waterStone', 'Assets/WaterStone.png?v=ssdsdsdxmlijnklsamdvokmdaa','Assets/spritesWaterStone.json?v=sdifjiufnafg'); 
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        game.load.atlas('pavan', 'Assets/pavan.png?v=ssdaa','Assets/pavan.json?v=nonoinm'); 
    }

    function create(){

    	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        powerFire = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        powerWater = game.input.keyboard.addKey(Phaser.Keyboard.TWO);

        backgroundMusic = game.add.audio('backgroundMusic');
        //backgroundMusic.loopFull();

        

        game.physics.startSystem(Phaser.Physics.ARCADE);

    	Background1 = game.add.sprite(0,0,'Background1');
    	Background1.width = gameWidth;
    	Background1.height = gameHeight;

    	Background11 = game.add.sprite(1000,0,'Background1');
    	Background11.width = gameWidth;
    	Background11.height = gameHeight;

    	Background2 = game.add.sprite(0,0,'Background2');
    	Background2.width = gameWidth;
    	Background2.height = gameHeight;

    	Background21 = game.add.sprite(1000,0,'Background2');
    	Background21.width = gameWidth;
    	Background21.height = gameHeight;

    	Background3 = game.add.sprite(0,0,'Background3');
    	Background3.width = gameWidth;
    	Background3.height = gameHeight;

    	Background31 = game.add.sprite(1000,0,'Background3');
    	Background31.width = gameWidth;
    	Background31.height = gameHeight;

    	Background4 = game.add.sprite(0,0,'Background4');
    	Background4.width = gameWidth;
    	Background4.height = gameHeight;

    	Background41 = game.add.sprite(1000,0,'Background4');
    	Background41.width = gameWidth;
    	Background41.height = gameHeight;

    	firePower1 = game.add.sprite(-100, -100, 'Powers');
        game.physics.arcade.enable(firePower1);
        firePower1.scale.setTo(0.5,0.5);
        firePower1.animations.add('FireBall', ['sprite2'],1,true);

        firePower2 = game.add.sprite(-100, -100, 'Powers');
        game.physics.arcade.enable(firePower2);
        firePower2.scale.setTo(0.5,0.5);
        firePower2.animations.add('FireWall', ['sprite13','sprite10','sprite11'],1,true);
      

    	Player = game.add.sprite(30, 440, 'Shruti');
    	game.physics.arcade.enable(Player);
        // Player.body.setSize(40, 50, 0, -2);
        Player.body.velocity.y = 0;
        Player.scale.setTo(3.5,3.5);
    	Player.frameName = 'sprite21';
        Player.animations.add ('ShrutiStill', ['sprite21','sprite19','sprite18'],5,false);
        Player.animations.add ('ShrutiLevitate', ['sprite13'],2,false);
        Player.animations.add ('ShrutiFly', ['sprite8','sprite7','sprite6','sprite5'],10,true);
        Player.body.collideWorldBounds = true;


        waterPower1 = game.add.sprite(-100, 770, 'Powers');
        game.physics.arcade.enable(waterPower1);
        waterPower1.body.velocity.y = 0;
        waterPower1.scale.setTo(4,4);
       	waterPower1.anchor.setTo(1,1);
        waterPower1.animations.add('waterBall', ['sprite3'],3,true);

        fireStone = game.add.sprite(1700, Math.random()*900,'fireStone');
        game.physics.arcade.enable(fireStone);
        fireStone.body.velocity.y = 0;
        fireStone.scale.setTo(3,3);

        waterStone = game.add.sprite(1700, Math.random()*900,'waterStone');
        game.physics.arcade.enable(waterStone);
        waterStone.body.velocity.y = 0;
        waterStone.scale.setTo(3,3);

        designer1 = game.add.sprite(1700,Math.random()*900,'FlyingEnemy');
       	game.physics.arcade.enable(designer1);
       	designer1.scale.setTo(3.5,3.5);
       	designer1.body.velocity.y = 0;
    	designer1.animations.add('Fly',['sprite1','sprite2','sprite3','sprite4','sprite5'],10,true);

    	designer2 = game.add.sprite(1700,Math.random()*900,'FlyingEnemy');
       	game.physics.arcade.enable(designer2);
       	designer2.scale.setTo(3.5,3.5);
       	designer2.body.velocity.y = 0;
    	designer2.animations.add('Fly',['sprite1','sprite2','sprite3','sprite4','sprite5'],10,true);

        pavan = game.add.sprite(900,480,'pavan');
        game.physics.arcade.enable(pavan);
        pavan.scale.setTo(3.5,3.5);
        pavan.body.velocity.y = 0;
        pavan.animations.add('run',['sprite1','sprite2','sprite3','sprite4'],10,true);

        TextSlate1 = game.add.text(340,100,'SHES MORE THAN A BIRD', {fontSize: '30px', fill: '#FFD700'});
        TextSlate1.font = 'Press Start 2P';
      

        TextSlate2 = game.add.text(320,200,'SHES MORE THAN A PLANE', {fontSize: '30px', fill: '#FFD700'});
        TextSlate2.font = 'Press Start 2P';



        TextSlate3 = game.add.text(400,300,'SHES A BIRDPLANE', {fontSize: '30px', fill: '#FFD700'});
        TextSlate3.font = 'Press Start 2P';


        TextSlate4 = game.add.text(530,400,'BIRD-PLANE!', {fontSize: '30px', fill: '#FFD700'});
        TextSlate4.font = 'Press Start 2P';



        TextSlate1.alpha = 0.0;
        TextSlate2.alpha = 0.0;
        TextSlate3.alpha = 0.0;
        TextSlate4.alpha = 0.0;

        startGame();

    }


    function update(){



        if(gameInProgress){

        	game.physics.arcade.overlap(Player, designer1, hitPlayer, null, this);
        	game.physics.arcade.overlap(Player, designer2, hitPlayer2, null, this);
        	game.physics.arcade.overlap(Player, fireStone, collectFire, null, this);
        	game.physics.arcade.overlap(firePower1, designer1, killDesigner1, null, this);
        	game.physics.arcade.overlap(firePower1, designer2, killDesigner2, null, this);



        	if(fireStoneNum == 1){
           		if(powerFire.isDown){
           			FireAbility(1);
           		}
           	} else if(fireStoneNum == 2){	
           		if (powerFire.isDown){
        			FireAbility(2);
        		}
        	}

           	


        	Spawner();

        	designer1.animations.play('Fly');
        	designer2.animations.play('Fly');

            pavan.animations.play('run');


            parallax1Background(Background1,Background11,2,1000);
            parallax1Background(Background2,Background21,5,1000);
            parallax1Background(Background3,Background31,7,1000);
            parallax1Background(Background4,Background41,9,1000);

            Player.animations.play('ShrutiFly');
            /*
            if(upKey.isDown){
        	   Player.body.velocity.y = -500;
            }

            if(downKey.isDown){
        	   Player.body.velocity.y = +500;
            }

            if(upKey.isUp && downKey.isUp){
            	Player.body.velocity.y = 0;
            }
            */


        }



        if (firePower1.body.position.x >= 1400){
        	firePower1.kill();
        }

        // if (firePower2.body.position.x >= 1400){

        // 	firePower2.kill();
        // }

    }



    function FireAbility(a) {

    	
        if(a == 1){
            if(game.time.now > FireBallTime){
            	firePower1 = game.add.sprite(Player.body.position.x + 30, Player.body.position.y +10, 'Powers');
                game.physics.arcade.enable(firePower1);
                firePower1.scale.setTo(0.5,0.5);
                firePower1.animations.add('FireBall', ['sprite2'],1,true);
            	firePower1.body.velocity.x = +400;
            	firePower1.animations.play('FireBall');
            	FireBallTime = game.time.now + 500;
            }
        } else if (a = 2){
        	firePower2 = game.add.sprite(Player.body.position.x + 100, Player.body.position.y +10, 'Powers');
            game.physics.arcade.enable(firePower2);
            firePower2.scale.setTo(2,2);
            firePower2.animations.add('FireWall', ['sprite13','sprite10','sprite11'],1,true);
        	firePower2.body.velocity.x = 100;
        	firePower2.animations.play('FireWall');
        }
    }

    // if(powerFire.isDown) {

    // 	firePower.body.velocity.y = +400;
    // 	firePower.body.velocity.x = +400;
    // }
    // if(firePower.body.position.x >= 1400 || firePower.body.position.y >= 780 ){

    // 	firePower.body.velocity.y = 0;
    // 	firePower.body.velocity.x = 0;
    // 	firePower.body.position.y = -500;
    // 	firePower.body.position.x = -0;
    // }

            // if(powerWater.isDown) {
            // 	waterPower1.body.velocity.x = +1000;
            // 	waterPower1.animations.play('waterBall');
            // }

            // if(waterPower1.body.position.x >= 1400){
            // 	waterPower1.body.velocity.x = 0;
            // 	waterPower1.body.position.x = -100;
            // }




     function parallax1Background(bg, bg1, a, bgWidth){
        if (bg.position.x < -bgWidth){
            bg.position.x = bgWidth;
        }

        else {

            bg.position.x -= a;

        }

        if (bg1.position.x < -bgWidth){
            bg1 .position.x = bgWidth;
        }
        else { 
            bg1.position.x -= a;

        }
    }

    function startGame(){
    	   firstLine = game.add.tween(TextSlate1).to( { alpha: 1 }, 1000, "Linear", true);
    	   firstLine.onComplete.add(onComplete,this);
    	   //});
    }

    function onComplete(){
    	firstLine = game.add.tween(TextSlate1).to( { alpha: 0 }, 1000, "Linear", true);	
    	secondLine = game.add.tween(TextSlate2).to( { alpha: 1 }, 1000, "Linear", true);
    	secondLine.onComplete.add(onComplete1,this);
    }

    function onComplete1(){
    	secondLine = game.add.tween(TextSlate2).to( { alpha: 0 }, 1000, "Linear", true);	
    	thirdLine = game.add.tween(TextSlate3).to( { alpha: 1 }, 1000, "Linear", true);
    	thirdLine.onComplete.add(onComplete2,this);
    }

    function onComplete2(){
    	thirdLine = game.add.tween(TextSlate3).to( { alpha: 0 }, 1000, "Linear", true);	
    	fourthLine = game.add.tween(TextSlate4).to( { alpha: 1 }, 1000, "Linear", true);
    	thirdLine.onComplete.add(onComplete3,this);
    }

    function onComplete3(){
    	thirdLine = game.add.tween(TextSlate4).to( { alpha: 0 }, 1000, "Linear", true);	
    	thirdLine.onComplete.add(onComplete4,this);
    	Player.body.velocity.y = -100;
    	Player.animations.play('ShrutiLevitate');

    }

    function onComplete4(){
    	Player.body.velocity.y = 0;
    	gameInProgress = true;
    }

    // Spawns objects randomly on the y axis and shoots them towards the left end of the screen.

    function Spawner(){


    	designer1.body.velocity.x = -800;
       	designer2.body.velocity.x = -500;
       	fireStone.body.velocity.x = -800;
       	waterStone.body.velocity.x = -1000;

        pavan.body.velocity.x = -500;

        if(designer1.body.position.x <= 0){
        	designer1.body.position.x = 1400;
        	designer1.body.position.y = Math.random()*900;
        	// console.log(designer1.body.position.x);
        }
        

        if(designer2.body.position.x <= 0){
        	designer2.body.position.x = 1400;
        	designer2.body.position.y = Math.random()*900;
        	// console.log(designer2.body.position.x);
        }


        if(fireStone.body.position.x <= 0){

        	fireStone.body.position.x = 7000;
        	fireStone.body.position.y = Math.random()*900;

        }
        

        if(waterStone.body.position.x <= 0){

        	waterStone.body.position.x = 10000;
        	waterStone.body.position.y = Math.random()*900;
        }


        if(pavan.body.position.x <= 0){
            pavan.body.position.x = (Math.random()*200)+1000;
        }

    }

    function hitPlayer(){

        playerHit++;

        designer1.body.position.x = 1400;

        // console.log('playerHit'); 

        if(playerHit == 3){

            endGame();
        }

    }

    function hitPlayer2(){

       	playerHit++;

       	designer2.body.position.x = 1400;

       	if(playerHit == 3) {
       		endGame();
       	}
    }

    function collectFire(){

       	fireStoneNum++;
       	fireStone.body.position.x = 7000;
       	fireStone.body.position.y = Math.random()*900;
       	console.log(fireStoneNum);


    }

    function killDesigner1(){

       	designer1.body.position.x = 1400;
       	designer1.body.position.y = Math.random()*900;
       	   	console.log("kill");

    }

    function killDesigner2(){

       	designer2.body.position.x = 1400;
       	designer2.body.position.y = Math.random()*900;

    }



    function endGame(){
       	gameInProgress = false;
    }

});




$("#secret").keydown(function(event){
    if(event.keyCode == 13){
        event.preventDefault();
        $("#send").trigger('click');
    }
});