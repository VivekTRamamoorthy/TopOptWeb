var SIMPtoggle=0;
var toggleSIMP = function (e){
    if(SIMPtoggle==0){
    SIMPtoggle=1;
    SIMPbutton= document.getElementById("SIMPbutton");
    SIMPbutton.innerText="SIMP is ON";
    
    }
    else if(SIMPtoggle==1){
        SIMPtoggle=0;
    SIMPbutton= document.getElementById("SIMPbutton");
    SIMPbutton.innerText="SIMP is OFF";

    }
    return
}