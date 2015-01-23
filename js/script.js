(function(){
	$(document).ready(function(){

		var game={};
		game.width=600;
		game.height=400;
		game.keys = [];
		game.start=false;

		game.player1={
			x:1,
			y:game.height/2-60,
			width:20,
			height:100,
			speed:8,
			rendered:false,
			score:0
		}

		game.player2={
			x:game.width-21,
			y:game.height/2-60,
			width:20,
			height:100,
			speed:8,
			rendered:false,
			score:0
		}
		game.ball={
			x:game.width/2 - 20,
			y:game.height/2 - 20,
			width:20,
			height:20,
			speed:8,
			rendered:false,
			orientation:Math.floor(Math.random()*2),
			direction:Math.floor(Math.random()*2)
		}
		game.pause = false
		game.contextBackground = document.getElementById("backgroundCanvas").getContext("2d");
		game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
		game.contextBall = document.getElementById("ballCanvas").getContext("2d");


		//fonctions qui gêre les Input/Output clavier
		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which]=true;
		});
		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});

		//fonction de detectation de collision
		function colistionDetect(player,enemy){
			 return(!(
                        ( ( player.y + player.height ) < ( enemy.y ) ) ||
                        ( player.y > ( enemy.y + enemy.height ) ) ||
                        ( ( player.x + player.width ) < enemy.x ) ||
                        ( player.x > ( enemy.x + enemy.width ) )
                    ))
		}

		//fonction qui render le joueur
		function renderPlayer(player){
				game.contextPlayer.clearRect(player.x,0,player.width,game.height);
				game.contextPlayer.fillRect(player.x,player.y,player.width,player.height);
				player.rendered=true;
			}

		//fonction qui render la balle
		function renderBall(){
				game.contextBall.clearRect(0,0,game.width,game.height);
				game.contextBall.fillRect(game.ball.x,game.ball.y,game.ball.width,game.ball.height);
				game.ball.rendered=true;
			}

		//fonctions qui gere le mouvement des deux joueurs
		function testplayer2key(){
			if(game.pause === false){
				if(game.keys[38])
				{	
					if(game.player2.y>0)
					{
						game.player2.y-=game.player2.speed;
						game.player2.rendered=false;
						game.start=true;
						game.ball.rendered = true;
					}
				}
				if(game.keys[40])
				{	
					if(game.player2.y<(game.height-game.player2.height))
					{
						game.player2.y+=game.player2.speed;
						game.player2.rendered=false;
						game.start=true;
						game.ball.rendered = true;
					}
				}
			}
		}
		function testplayer1key(){
			if(game.pause === false){
				if(game.keys[90])
				{	
					if(game.player1.y>0)
					{
						game.player1.y-=game.player1.speed;
						game.player1.rendered=false;
						game.start=true;
						game.ball.rendered = true;
					}
				}
				if(game.keys[83])
				{	
					if(game.player1.y<(game.height-game.player1.height))
					{
						game.player1.y+=game.player1.speed;
						game.player1.rendered=false;
						game.start=true;
						game.ball.rendered = true;
					}
				}
			}
		}

		//fonction mouvement de la balle
		function ballMouvment(){
			if(game.ball.direction===1)
			{
				if(game.ball.orientation===0){
					if(game.ball.y<game.height-game.ball.height)
					{
						game.ball.x+=game.ball.speed;
						game.ball.y+=game.ball.speed;
					}
					else game.ball.orientation=1;
				}

				if(game.ball.orientation===1){
					if(game.ball.y>0)
					{
						game.ball.x+=game.ball.speed;
						game.ball.y-=game.ball.speed;
					}
					else game.ball.orientation=0;
				}
			}
			else if(game.ball.direction===0)
			{
				if(game.ball.orientation===0){
					if(game.ball.y<game.height-game.ball.height)
					{
						game.ball.x-=game.ball.speed;
						game.ball.y+=game.ball.speed;
					}
					else game.ball.orientation=1;
				}

				if(game.ball.orientation===1){
					if(game.ball.y>0)
					{
						game.ball.x-=game.ball.speed;
						game.ball.y-=game.ball.speed;
					}
					else game.ball.orientation=0;
				}
			}
		}

		//fonctions traitement des collisions
		function collisionPlayer1(){
			if(colistionDetect(game.player1,game.ball)){
				game.ball.direction=1;
			}
		}
		function collisionPlayer2(){
			if(colistionDetect(game.player2,game.ball)){
				game.ball.direction=0;
			}
		}

		//Fonction calcul du score
		function score(){
			if(game.ball.x<=0) {
				game.player2.score++;
				game.ball.rendered=false;
				game.pause = true;
				setTimeout(function() {
					game.pause = false;
					initPlayer();
				}, 500);
			}
			if(game.ball.x>=game.width-game.ball.width){
				game.player1.score++;
				game.ball.rendered=false;
				game.pause = true;
				setTimeout(function() {
					game.pause = false;
					initPlayer();
				}, 500);
			}

		}

		//fonction initialisation des joueurs
		function initPlayer(){
			game.player1.x=1;
			game.player1.y=game.height/2-60;
			game.player2.x=game.width-21;
			game.player2.y=game.height/2-60;
		}

		//fonction initialisation de la balle
		function initBall(){
			game.ball.x=game.width/2 - 20;
			game.ball.y=game.height/2 -20;
			game.direction=Math.floor(Math.random()*2);
			game.orientation=Math.floor(Math.random()*2);
			game.start=false;
			game.redered=true;
		}

		function init(){
			
			loop();
			renderPlayer(game.player1);
			renderPlayer(game.player2);
		}

		function update(){
			testplayer2key();
			testplayer1key();
			if(game.start===true)
			ballMouvment();
			collisionPlayer1();
			collisionPlayer2();
			score();
		}

		function render(){
			game.contextBackground.font = "bold 20px monaco";
			game.contextBackground.fillStyle="white";
			game.contextBackground.clearRect(0,0,game.width,game.height);
			game.contextBackground.fillText(game.player1.score,5,20);
			game.contextBackground.fillText(game.player2.score,game.width-25,20);


			game.contextPlayer.fillStyle="white";
			game.contextBall.fillStyle="white";

			// if(!game.player1.rendered)
			// 	renderPlayer(game.player1);

			// if(!game.player2.rendered)
			// 	renderPlayer(game.player2);

			if(game.ball.rendered===false){
				initBall();
				initPlayer();
				
			}
			
			if(game.start===true){
				renderBall();
				renderPlayer(game.player1);
				renderPlayer(game.player2);	
			}
			
		}

		function loop(){
			requestAnimFrame(function(){
				loop();
			});
			update();
			render();
		}

	init();
	})
})();

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame    	 ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();