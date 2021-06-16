let the_block;
let config={
    gameSize:"10*20",
    gameCell:40,
    cells:[],
    smallCells:[],
    blockData:[
        {
            'color':'#FEFE00',
            'data':[[[1,0,0],[1,0,0],[1,1,0]],
            [[1,1,1],[1,0,0],[0,0,0]],
            [[0,1,1],[0,0,1],[0,0,1]],
            [[0,0,0],[0,0,1],[1,1,1]]],
        },
        {
            'color':'#FE00FF',
            'data':[[[0,0,1],[0,0,1],[0,1,1]],
            [[0,0,0],[1,0,0],[1,1,1]],
            [[1,1,0],[1,0,0],[1,0,0]],
           [[1,1,1],[0,0,1],[0,0,0]]],
        },
        {
            'color':'#00FEFE',
            'data':[[[1,1,0],[0,1,1],[0,0,0]],
            [[0,0,1],[0,1,1],[0,1,0]],
            [[0,0,0],[1,1,0],[0,1,1]],
            [[0,1,0],[1,1,0],[1,0,0]]],
        },
        {
            'color':'#FE6633',
            'data':[[[0,1,1],[1,1,0],[0,0,0]],
           [[1,0,0],[1,1,0],[0,1,0]],
            [[0,0,0],[0,1,1],[1,1,0]],
            [[0,1,0],[0,1,1],[0,0,1]]],
        },
        {
            'color':'#FE0000',
            'data':[[[0,0,0],[1,1,1],[0,1,0]],
            [[0,1,0],[1,1,0],[0,1,0]],
            [[0,1,0],[1,1,1],[0,0,0]],
            [[0,1,0],[0,1,1],[0,1,0]]],
        },
        {
            'color':'#0000FE',
            'data':[[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
            [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
            [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
            [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]]],
        },
        {
            'color':'#009800',
            'data':[[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
                    [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
                    [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]],
                    [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]],
        },
    ],
    musicData:{},
    isStop:false,
    setRotate:false,
    isRotate:true,
    score:0,
}
document.querySelector('#score').innerHTML=config.score;
let onLoadMusic=new CustomEvent('load_music',{detail:{}});
let c1=document.querySelector("#showGame");
let v2=document.querySelector("#showRandomCell");
let ctx=c1.getContext('2d');
let c2=v2.getContext('2d');
let smallWH=4*40+5;
let cw=config.gameSize.split('*')[0]*config.gameCell+parseInt(config.gameSize.split('*')[0])+1;
let ch=config.gameSize.split('*')[1]*config.gameCell+parseInt(config.gameSize.split('*')[1])+1;
c1.width=cw;
c1.height=ch;
v2.width=smallWH;
v2.height=smallWH;
function init(){
    drawBoard();
    loadMusic();
}
function loadMusic(){
    let names=['bgMusic','clearFullRowsMusic'];
    let loadCount=0;
   for(let name of names){
       let audio=new Audio();
       audio.addEventListener('canplaythrough',(e)=>{
            loadCount++;
            if (loadCount===names.length){
                document.dispatchEvent(onLoadMusic);
            }
       })
       config.musicData[name]=audio;
       audio.src="music/"+name+'.mp3';
   }
    config.musicData.bgMusic.loop=true;

}
function randomInt(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
}
function clockWhite(){
    for (let r=0;r<20;r++){
        config.cells[r]=[];
        for (let c=0;c<10;c++){
            config.cells[r][c]='WHITE'
        }
    }
}
clockWhite();

function drawCell(c,r,color){
    ctx.fillStyle = color;
    ctx.fillRect(c * 41, r * 41, 41, 41);
    ctx.strokeStyle='#ccc'
    ctx.strokeRect(c*41,r*41,41,41)
}
function clearCell(c,r){
    drawCell(c,r,"WHITE")
}
function setScore(val){
    config.score+=val;
    document.querySelector('#score').innerHTML=config.score;
}
function drawSmallCell(c,r,color){
    c2.fillStyle = color;
     c2.fillRect(c * 41, r * 41, 41, 41);
    c2.strokeStyle='#ccc'
    c2.strokeRect(c*41,r*41,41,41)
}
function drawBoard() {
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 10; c++) {
            drawCell(c, r,config.cells[r][c])
        }
    }
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            drawSmallCell(c, r,'white')
        }
    }
}
class Block{
    constructor(r,c,color,shape) {
        this.r=r;
        this.c=c;
        this.color=color;
        this.shape=shape;
        this.shape_idx=Math.floor(Math.random()*(this.shape.length));
    }
    get cur_shape(){
        return this.shape[this.shape_idx]
    }
    drawSmall(){
        for (let r=0;r<this.cur_shape.length;r++){
            for (let c=0;c<this.cur_shape[r].length;c++){
                if (this.cur_shape[r][c]){
                    drawSmallCell(c,r,this.color);
                }
            }
        }
    }
    draw(){
        for (let r=0;r<this.cur_shape.length;r++){
            for (let c=0;c<this.cur_shape[r].length;c++){
                if (this.cur_shape[r][c]){
                    drawCell(c+this.c,r+this.r,this.color);
                }
            }
        }
    }
    clear(){
        for(let r=0;r<this.cur_shape.length;r++){
            for (let c=0;c<this.cur_shape[r].length;c++){
                if (this.cur_shape[r][c]){
                    clearCell(this.c+c,this.r+r);
                }
            }
        }
    }
    drop(){
        if(!this.isCollide(0,1,this.cur_shape))
        {
            this.clear()
            this.r++;
            this.draw();
        }else {
            let game_over=false;
                for (let r=0;r<this.cur_shape.length;r++){
                    for (let c=0;c<this.cur_shape[r].length;c++){
                        if (this.cur_shape[r][c]){
                            this.r+r<=0&&(game_over=true);
                            this.r+r>=0&&(config.cells[this.r+r][this.c+c]=this.color);
                        }
                    }
                }
                this.isClearFullRows();
                drawBoard();
                if (game_over){
                    clearInterval(the_block);
                    config.musicData.bgMusic.pause();
                    document.querySelector('.block').style.display='flex';
                }else {
                    getBlock();
                }
            }
    }
    rotate(){
        if (!config.isStop&&!config.setRotate) {
            this.clear();
            this.shape_idx = (this.shape_idx + 1) % this.shape.length;
                if (this.cur_shape === config.blockData[5].data[this.shape_idx]) {
                    if (this.isCollide(0, 0, this.cur_shape)) {
                        if (this.c > 5) {
                            this.c -= 2
                        } else {
                            this.c += 2
                        }
                    }
                    if (this.isCollide(0, 1, this.cur_shape)) {
                        if (this.r > 10) {
                            this.r -= 2
                        }
                    }
                } else {
                    if (this.isCollide(0, 0, this.cur_shape)) {
                        if (this.c > 5) {
                            this.c--
                        } else {
                            this.c++
                        }
                    }
                    if (this.isCollide(0, 1, this.cur_shape)) {
                        if (this.r > 10) {
                            this.r--
                        }
                    }
                }
            this.draw();
        }
    }
    move(dir){
        if (!config.isStop) {
            this.clear();
            switch (dir) {
                case "Left":
                    if (!this.isCollide(-1, 0, this.cur_shape)) {
                        this.c--
                    }
                    break;
                case "Right":
                    if (!this.isCollide(1, 0, this.cur_shape)) {
                        this.c++
                    }
                    break;
            }
            this.draw();
        }
    }
    isCollide(x,y,block){
        for (let r=0;r<block.length;r++){
            for (let c=0;c<block[r].length;c++){
                if (!block[r][c]){
                    continue;
                }
                let newX=this.c+c+x;
                let newY=this.r+r+y;
                if (newX<0||newX>=10||newY>=20){
                    return  true;
                }
                if (newY<0){
                    continue;
                }
                if (config.cells[newY][newX]!=='WHITE'){
                    return  true;
                }
            }
        }
        return false;
    }
    isClearFullRows(){
        for (let r=0;r<20;r++){
            let isRowFull=true;
            for (let c=0;c<10;c++){
                isRowFull=isRowFull&&config.cells[r][c]!=="WHITE";
            }
            if (isRowFull){
                config.musicData.clearFullRowsMusic.play();
                setScore(100);
                for( let y = r; y > 1; y--){
                    for( let c = 0; c < 10; c++){
                        config.cells[y][c] = config.cells[y-1][c];
                    }
                }
                for (let c=0;c<10;c++){
                    config.cells[0][c]='WHITE';
                }
            }
        }
        drawBoard();
    }
}
init();
getBlock();
function getBlock(){
    the_block=new Block(-3,3,config.blockData[randomInt(0,config.blockData.length-1)].color,config.blockData[randomInt(0,config.blockData.length-1)].data)
    the_block.drawSmall();
}
document.addEventListener('keydown',(e)=>{
    if (e.code==="Space"){
        the_block.rotate();
        config.setRotate=true;
    }else if (e.code==="ArrowRight"){
        the_block.move(e.code.replace('Arrow',''));
    }else if (e.code==="ArrowLeft"){
        the_block.move(e.code.replace('Arrow',''));
    }else if (e.code==="ArrowDown"){
        if (!config.isStop){
            the_block.drop();
        }
    }
})
document.addEventListener('keyup',(e)=>{
    if (e.code==="Space"){
        config.setRotate=false;
    }
})
let interval;
function start(){
    config.musicData.bgMusic.play();
    config.isStop=false;
    if (!interval){
        interval=setInterval(function(){
            the_block.drop();
        },500)
    }
}
function stop(){
    clearInterval(interval);
    interval='';
    config.isStop=true;
}
document.querySelector('#rest').addEventListener('click',()=>{
    document.querySelector('.block').style.display='none';
    config.musicData.bgMusic.play();
    config.musicData.bgMusic.currentTime=0;
    clockWhite();
    drawBoard();
    config.score=0;
    setScore(0);
    getBlock();
})
document.querySelector('.startGame').addEventListener('click',()=>{
    start();
})
document.querySelector('.stopGame').addEventListener('click',()=>{
    stop();
})
document.querySelector('.stopMusic').addEventListener('click',()=>{
   config.musicData.bgMusic.pause();
})
document.querySelector('.startMusic').addEventListener('click',()=>{
    config.musicData.bgMusic.play();
    config.musicData.bgMusic.currentTime=0;
})

