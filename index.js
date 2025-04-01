let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

function getPlayerName() {
    localStorage.removeItem("playerName");

    let name = prompt("Nhập tên của bạn:");

    // Nếu người chơi nhập, lưu vào localStorage
    if (name) {
        localStorage.setItem("playerName", name);
    }

    return name;
}


let carPic= document.getElementById("carPic");
let obsPic= document.getElementById("obsPic");
let rewardPic= document.getElementById("rewardPic");

let obtacles = generateObtacles(7);
let rewards= generateRewards(5);
let score =0 ;
let gameRunning = true;
function generateObtacles(count){
    let obs=[];
    for(let i=0;i<count;i++){
        obs.push({
            pic: obsPic,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 40
        });
    }
    return obs;
}
function generateRewards(count){
    let reward=[];
    for(let i=0;i<count;i++){
        reward.push({
            pic: rewardPic,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 40
        });
    }return reward;
}
function handleKeyDown(event){
    if(event.keyCode==38) car.direction="up";
    if(event.keyCode==40) car.direction="down";
    if(event.keyCode==37) car.direction="left";
    if(event.keyCode==39) car.direction="right";
    if(event.keyCode==17) car.speed=5;
}
addEventListener("keydown",handleKeyDown);
addEventListener("keyup",(event) =>{if(event.keyCode==17) car.speed=2});
function carMove(){
    if(car.direction=="right")car.x+=car.speed
    if(car.direction=="left")car.x-=car.speed;
    if(car.direction=="down")car.y+=car.speed;
    if(car.direction=="up")car.y-=car.speed;

    if(car.x<0) car.x=0;
    if(car.y<0) car.y=0;
    if(car.x+40>canvas.width)car.x=canvas.width-40;
    if(car.y+40>canvas.height) car.y=canvas.height-40;

}
function checkCollision(){
    for(let obs of obtacles){
        if(car.x<obs.x +obs.size && car.x + 40>obs.x
            && car.y<obs.y +obs.size && car.y + 40>obs.y){
            gameRunning = false;
            alert("game over");
        }
    }
    for(let reward of rewards){
        if(car.x<reward.x+reward.size && car.x + 40>reward.x
            && car.y<reward.y+reward.size && car.y + 40>reward.y){
            score++;
            reward.x= Math.random() * canvas.width;
            reward.y= Math.random() * canvas.height
        }
    }
}

function drawGame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.drawImage(carPic,car.x,car.y, 50, 40);


    obtacles.forEach(obs => ctx.drawImage(obs.pic,obs.x,obs.y, obs.size, obs.size));


    rewards.forEach(reward => ctx.drawImage(reward.pic,reward.x,reward.y, reward.size, reward.size));

    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.fillText(score,20,40);

}
function addScore(name, score) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name, score });

    // Sắp xếp điểm từ cao đến thấp
    leaderboard.sort((a, b) => b.score - a.score);

    // Giới hạn top 10 người chơi
    leaderboard = leaderboard.slice(0, 10);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}
function showLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let tableBody = document.getElementById("leaderboard");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    leaderboard.forEach((player, index) => {
        let row = `<tr>
                    <td>#${index + 1}</td>
                    <td>${player.name}</td>
                    <td>${player.score}</td>
                </tr>`;
        tableBody.innerHTML += row;
    });
}
let playerName = getPlayerName();

function gameRun(){

    if(!gameRunning){
        addScore(playerName, score);
        showLeaderboard()
        return};
    carMove()
    checkCollision();
    drawGame();
    requestAnimationFrame(gameRun);

}
gameRun();

