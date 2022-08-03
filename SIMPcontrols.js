
// SIMP RUN AND STOP CONTROLS

var SIMPisRunning=false;
const toggleSIMP = function (e){
    if(SIMPisRunning){
        SIMPisRunning=false;
    SIMPbutton= document.getElementById("SIMPbutton");
    SIMPbutton.innerHTML=`<i class="fa fa-play" aria-hidden="true"></i>`;

    
    }
    else {
    SIMPisRunning=true;
    SIMPbutton= document.getElementById("SIMPbutton");
    SIMPbutton.innerHTML=`<i class="fa fa-stop" aria-hidden="true"></i>`;
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

const whitebox =document.getElementById('whitebox');
const blackbox =document.getElementById('blackbox');
const graybox =document.getElementById('graybox');

const voidPaintMode = ()=>{
    designVariableToPaint = 0;
    document.querySelectorAll(".box").forEach(elem=> elem.classList.remove("ispicked"))
    whitebox.classList.add("ispicked")
}

const solidPaintmMode = ()=>{
    designVariableToPaint = 1;
    document.querySelectorAll(".box").forEach(elem=> elem.classList.remove("ispicked"))
    blackbox.classList.add("ispicked")
}
const grayPaintmMode = ()=>{
    designVariableToPaint = 0.5;
    document.querySelectorAll(".box").forEach(elem=> elem.classList.remove("ispicked"))
    graybox.classList.add("ispicked")
}

whitebox.addEventListener('click',voidPaintMode)
blackbox.addEventListener('click',solidPaintmMode)
graybox.addEventListener('click',grayPaintmMode)

whitebox.addEventListener('touchdown',voidPaintMode)
blackbox.addEventListener('touchdown',solidPaintmMode)
graybox.addEventListener('touchdown',grayPaintmMode)


const canvas =document.getElementById('shape');
var mouseDownIndicator=false

canvas.addEventListener('mousedown',()=>{
    mouseDownIndicator=true
})
canvas.addEventListener('mouseup',()=>{
    mouseDownIndicator=false
})
canvas.addEventListener('mousemove',(event)=>{
    if(mouseDownIndicator){
        let rect = canvas.getBoundingClientRect();

    let mousex=event.layerX-rect.left;
    let mousey=event.layerY-rect.top;
    let col = Math.floor(mousex/canvas.clientWidth*nelx);
    let row = Math.floor((mousey/canvas.clientHeight)*nely);

    x[row][col]=designVariableToPaint;
    image(sub(1,x))
    }
})



const handleTouch = (event)=>{
    event.preventDefault()
    let rect = canvas.getBoundingClientRect();
    let mousex=event.touches[0].clientX-rect.left;
    let mousey=event.touches[0].clientY-rect.top;
    let col = Math.floor(mousex/canvas.clientWidth*nelx);
    let row = Math.floor((mousey/canvas.clientHeight)*nely);

    x[row][col]=designVariableToPaint;
    image(sub(1,x))
}

canvas.addEventListener('touchmove',handleTouch)
canvas.addEventListener('touchstart',handleTouch)