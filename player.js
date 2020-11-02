const myVideo = document.getElementById('myVideo');
const btnPlay = document.getElementById('btnPlay');
const btnPause = document.getElementById('btnPause');
const btnStop = document.getElementById('btnStop');
const timeOut = document.getElementById('timeOut');
const vidNumOut = document.getElementById('vidNum');
let timer = null;

btnPlay.addEventListener('click',vidAction);
btnPause.addEventListener('click',vidAction);
btnStop.addEventListener('click',vidAction);
btnNext.addEventListener('click',nextVideo);
myVideo.addEventListener('ended', vidEnded);

const vids = ["https://tna-video-player.s3.amazonaws.com/66/UKSC/1/cr1-09-10-19-session-1_imx30_1.mp4","https://tna-video-player.s3.amazonaws.com/66/UKSC/1/cr1-09-10-19-session-1_imx30_1","https://tna-video-player.s3.amazonaws.com/66/UKSC/1/cr1-09-10-20-session1_imx30_1","https://tna-video-player.s3.amazonaws.com/66/UKSC/1/cr1-09-12-10-session-1_imx30_1"];
let vidPlaying = 0;

function vidAction(event){
  switch(event.target.id){
    case "btnPlay":
      playVideo();
      timer = setInterval(update, 100);
      break;
    case "btnPause":
      myVideo.pause();
      break;
    case "btnStop":
      myVideo.pause();
      myVideo.currentTime = 0;
      break;
  }
}

function playVideo(){
  myVideo.play();
    timer = setInterval(update, 100);
}

function update() {
  timeOut.innerHTML = "Time: " + myTime(myVideo.currentTime) + "/" +myTime(myVideo.duration);
}

function myTime(time) {
    var hr = ~~(time / 3600);
    var min = ~~((time % 3600) / 60);
    var sec = time % 60;
    var sec_min = "";
    if (hr > 0) {
      sec_min += "" + hrs + ":" + (min < 10 ? "0" : "");
    }
    sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
    sec_min += "" + Math.round(sec);
    return sec_min;
}

function vidEnded(){
  clearInterval(timer);
  timeOut.innerHTML = "Timer: 0";
  nextVideo();
  playVideo();
}

function nextVideo(){
  if(vidPlaying < 3){
    vidPlaying++;
  } else {
    vidPlaying = 0;
  }
  myVideo.src = vids[vidPlaying];
  vidNum.innerHTML = (vidPlaying+1) +"/4";
}
