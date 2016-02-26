


function play(){
  swfobject.getObjectById('showmedia_video_player').playVideo();
}
function pause(){
  swfobject.getObjectById('showmedia_video_player').pauseVideo();
}
function togglePlay(){
  swfobject.getObjectById('showmedia_video_player').togglePlayPause();
}
function seek(time){
  swfobject.getObjectById('showmedia_video_player').seek(time);
}
function setVolume(vol){
  swfobject.getObjectById('showmedia_video_player').setVolume(vol);
}
function mute(){
  swfobject.getObjectById('showmedia_video_player').mute();
}
function unmute(){
  swfobject.getObjectById('showmedia_video_player').unmute();
}
function toggleMute(){
  swfobject.getObjectById('showmedia_video_player').toggeMute();
}
function getDuration(){
  return swfobject.getObjectById('showmedia_video_player').getDuration();
}
function getPlayhead(){
  return swfobject.getObjectById('showmedia_video_player').getPlayhead();
}
function addCallbackAtElapsed(call,elap){
  swfobject.getObjectById('showmedia_video_player').addCallbackAtElapsed(call,elap);
}
function removeCallbackAtElapsed(call,elap){
  swfobject.getObjectById('showmedia_video_player').removeCallbackAtElapsed(call,elap);
}

