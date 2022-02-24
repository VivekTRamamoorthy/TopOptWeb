
// SIMP RUN AND STOP CONTROLS

var SIMPisRunning=false;
var toggleSIMP = function (e){
    if(SIMPisRunning){
        SIMPisRunning=false;
    SIMPbutton= document.getElementById("SIMPbutton");
    SIMPbutton.innerText="Keep running";

    
    }
    else {
    SIMPisRunning=true;
    SIMPbutton= document.getElementById("SIMPbutton");
    SIMPbutton.innerText="Stop";
    SIMPupdateloop()

    }
}


function SIMPupdateloop(){
    if (SIMPisRunning){
        SIMP1generation()
        window.requestAnimationFrame(SIMPupdateloop)
    }
}



// PAINT CONTROLS

var designVariableToPaint=0.5;

var whitebox =document.getElementById('whitebox');
var blackbox =document.getElementById('blackbox');
var graybox =document.getElementById('graybox');

whitebox.addEventListener('click',()=>{
    designVariableToPaint = 0;
    document.querySelectorAll(".box").forEach(elem=> elem.classList.remove("ispicked"))
    whitebox.classList.add("ispicked")

})
blackbox.addEventListener('click',()=>{
    designVariableToPaint = 1;
    document.querySelectorAll(".box").forEach(elem=> elem.classList.remove("ispicked"))
    blackbox.classList.add("ispicked")
})
graybox.addEventListener('click',()=>{
    designVariableToPaint = 1;
    document.querySelectorAll(".box").forEach(elem=> elem.classList.remove("ispicked"))
    graybox.classList.add("ispicked")
})



var canvas =document.querySelector('canvas');
var mouseDownIndicator=false

canvas.addEventListener('mousedown',()=>{
    mouseDownIndicator=true
})
canvas.addEventListener('mouseup',()=>{
    mouseDownIndicator=false
})
canvas.addEventListener('mousemove',(event)=>{
    if(mouseDownIndicator){
    // console.log(event)
    let mousex=event.layerX
    let mousey=event.layerY
    let col = Math.floor(mousex/canvas.clientWidth*nelx);
    let row = Math.floor((mousey/canvas.clientHeight)*nely);
    // console.log(mousex,canvas.width,mousey,canvas.height,row,col)

    x[row][col]=designVariableToPaint;
    image(sub(1,x))
    }
})
