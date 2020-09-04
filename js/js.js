function start(){
    $("#inicio").hide();

    inicio_jogo = true;
    $("#fundoGame").append("<div id='jogador' class='anima1'></div>")
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>")
    $("#fundoGame").append("<div id='inimigo2'></div>")
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>")
    $("#fundoGame").append("<div id='placar'></div>");

}

var jogo = {};
jogo.timer = setInterval(loop,30);
var inicio_jogo = false;

var pontos=0;
var salvos=0;
var perdidos=0;

var somExplosao=document.getElementById("somExplosao");
var somDisparo=document.getElementById("somDisparo");
var musica=document.getElementById("musica");

musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
musica.play();
function loop(){
    if(inicio_jogo){
        movefundo();
        movejogador(); 
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        $("#placar").html("<h2> Pontos: "+pontos +" Salvos: "+salvos+ " Perdidos: "+perdidos+"</h2>")
    }
    else{

    $("#inicio").show(); 
    $("#jogador").remove(); 
    $("#inimigo1").remove(); 
    $("#inimigo2").remove();
    $("#amigo").remove();
    }
}
 function movefundo(){
    esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda-1);
 }

var TECLA = {
    W: 87,
    S: 83,
    D: 39
}

var quantidade_tiros = 0;
jogo.pressionou = [];

$(document).keydown(
    function(e){
        jogo.pressionou[e.which] = true;
    }
);
$(document).keyup(
    function(e){
        jogo.pressionou[e.which] = false;
    }
);
function movejogador(){   
    var topo = parseInt($("#jogador").css("top"))
   
    if(jogo.pressionou[TECLA.W] && topo >= 10){
         
        $("#jogador").css("top", topo-10);
    }
    if(jogo.pressionou[TECLA.S] && topo <= 430){
        $("#jogador").css("top", topo+10);
    }
    if(jogo.pressionou[TECLA.D]){  
        disparo();
    } 
}

var velocidade=5;
var posicaoY = parseInt(Math.random()*330);

function moveinimigo1(){
    posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", posicaoX-velocidade);
    $("#inimigo1").css("top",posicaoY);
    if(posicaoX<=0){
        posicaoY = parseInt(Math.random()*330);
        $("#inimigo1").css("left",694);
        $("#inimigo1").css("top",posicaoY)
    }
}

function moveinimigo2(){
    posicaoX = parseInt($("#inimigo2").css('left'));
    $("#inimigo2").css("left",posicaoX - 2);
    if(posicaoX<=0){
        $("#inimigo2").css("left",775);
    }
}
function moveamigo(){
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left",posicaoX+1);
    if(posicaoX>906){
        salvos++;
        $("#amigo").css("left",0);
    }
}

var podeAtirar=true;

function disparo() {
	
	if (podeAtirar==true) {
		
        podeAtirar=false;
        
        topo = parseInt($("#jogador").css("top"))
        posicaoX= parseInt($("#jogador").css("left"))
        tiroX = posicaoX + 190;
        topoTiro=topo+37;
        $("#fundoGame").append("<div id='disparo'></div");
        $("#disparo").css("top",topoTiro);
        $("#disparo").css("left",tiroX);
        
        var tempoDisparo=window.setInterval(executaDisparo, 30);  
        somDisparo.play();  
    } 
 
   	    function executaDisparo() {
	    posicaoX = parseInt($("#disparo").css("left"));
	    $("#disparo").css("left",posicaoX+15); 

        var colisao1 = ($("#disparo").collision($("#inimigo1")));
        var colisao2 = ($("#disparo").collision($("#inimigo2")));
        if(colisao2.length > 0){ 
 
            pontos=pontos+10;

            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao1(inimigo2X, inimigo2Y);
            		
			window.clearInterval(tempoDisparo);
			tempoDisparo=null;
			$("#disparo").remove();
            podeAtirar=true;
            $("#inimigo2").remove();
            setTimeout(function(){  
                if( $("#inimigo2").length<=0){
                $("#fundoGame").append("<div id='inimigo2'></div>");
                $("#inimigo2").css("left",775);
                }
            },20000);
        }
        if(colisao1.length > 0){ 

            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

			window.clearInterval(tempoDisparo);
			tempoDisparo=null;
			$("#disparo").remove();
            podeAtirar=true;

            quantidade_tiros++;
     
        }
        if(quantidade_tiros >= 2)
        {  
            pontos=pontos+20;
            quantidade_tiros = 0;

			window.clearInterval(tempoDisparo);
			tempoDisparo=null;
			$("#disparo").remove();
            podeAtirar=true;

    
            posicaoY = parseInt(Math.random()*334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top", posicaoY);
             
            
        }
        else if (posicaoX>900) {			
			window.clearInterval(tempoDisparo);
			tempoDisparo=null;
			$("#disparo").remove();
			podeAtirar=true;
        }
	}  
} 
function colisao(){
    var colisao1 = ($("#jogador").collision($("#inimigo1")))

    if(colisao1.length > 0){        
        inimigo1X = parseInt($("#jogador").css("left"));
        inimigo1Y = parseInt($("#jogador").css("top"));
        explosao1(inimigo1X, inimigo1Y);
         
        $("#jogador").remove();
       
        setTimeout(function(){ inicio_jogo = false; },2000);
    }

    var colisao6 = ($("#amigo").collision($("#inimigo2")))
    if(colisao6.length > 0){ 
    amigoX = parseInt($("#amigo").css("left"));
    amigoY = parseInt($("#amigo").css("top"));
    explosao3(amigoX, amigoY);
    $("#amigo").css("left",0);
    }
}
function explosao1(inimigoX, inimigoY){

    var div_verificar=$("#explosao1");

    if(div_verificar.length >0){
        div_verificar.remove();
    }
 
    var tempoExplosao=window.setInterval(removeExplosao, 1000);
    $("#fundoGame").append("<div id='explosao1' style='position:absolute; background-size: 200px 85px; background-repeat: no-repeat; background-image: url(imgs/explosao.png); ; width: 200px; height:85px;'></div>");  
   
    var div=$("#explosao1");
    div.css("top", inimigoY);
    div.css("left", inimigoX);  
    div.animate({width:200, opacity:0}, "slow");

    somExplosao.play();
    function removeExplosao(){
        div.remove();
        window.clearInterval(tempoExplosao);
        tempoExplosao=null;
    }
}
function explosao3(amigoX,amigoY) {
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top",amigoY);
    $("#explosao3").css("left",amigoX);
    var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
    function resetaExplosao3() {
    $("#explosao3").remove();
    window.clearInterval(tempoExplosao3);
    tempoExplosao3=null;

    somExplosao.play();
    perdidos++;
    }
}
