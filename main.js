// This function computes 

// SAMPLE SHAPE


var nelx=15,nely=15, volfrac=0.5,penal=2,rmin=1,ft=2;
var x=mul(volfrac,ones(nelx,nely))
image(x);

// %% MATERIAL PROPERTIES
// E0 = 1;
// Emin = 1e-9;
// nu = 0.3;
const E0 = 1;
const Emin = 1e-9;
const nu = 0.3;

// %% PREPARE FINITE ELEMENT ANALYSIS
const A11 = [[12, 3, -6, -3], [3, 12, 3, 0], [-6, 3, 12, -3], [-3, 0, -3, 12]];
const A12 = [[-6, -3, 0, 3],[ -3, -6, -3, -6],[ 0, -3, -6, 3],[ 3 ,-6 ,3 ,-6]];
const B11 = [[-4, 3, -2, 9],[ 3, -4, -9, 4],[ -2, -9, -4, -3],[ 9, 4, -3 ,-4]];
const B12 = [[ 2, -3, 4, -9],[ -3, 2, 9, -2],[ 4, 9 ,2 ,3],[ -9, -2, 3, 2]];

let temp1 = concatCols(concatRows(A11,A12),concatRows(transpose(A12),A11));
let temp2= concatCols(concatRows(B11,B12),concatRows(transpose(B12),B11));
var KE=mul(1/(1-nu**2)/24,  add(temp1,mul(temp2,nu))  );

const nodenrs = reshape([range(1,(1+nelx)*(1+nely))],1+nely,1+nelx )

temp1= add(1,mul(2, get(nodenrs,range(1,nodenrs.length-1),range(1,nodenrs[0].length-1) ) ))
const edofVec =  reshape(temp1,nelx*nely,1);

temp1 = repmat(edofVec,1,8);
temp2=repmat([[0, 1, 2*nely+2, 2*nely+3, 2*nely+0,2*nely+1, -2, -1]],nelx*nely,1);
const edofMat = add(temp1,temp2)

const iK= reshape(transpose(kron(edofMat,ones(8,1))) , 64*nelx*nely,1)

const jK= reshape(transpose(kron(edofMat,ones(1,8))) , 64*nelx*nely,1)

// DEFINE LOADS AND SUPPORTS (HALF MBB-BEAM)
temp1=zeros(2*(nely+1)*(nelx+1),1)
temp1[1]=[-1];
const F =temp1;

var U = zeros(2*(nely+1)*(nelx+1),1);

const fixeddofs = union(range(1,2,2*(nely+1)),2*(nelx+1)*(nely+1));

const alldofs = range(1,2*(nely+1)*(nelx+1));

const freedofs = setdiff(alldofs,fixeddofs);


var H=eye(nelx*nely);
var Hs=ones(nelx*nely,1);


// %% INITIALIZE ITERATION
x=repmat([[volfrac]],nely,nelx); // the double square bracket is because repmat first argument must be a matrix

var xPhys=deepcopy(x);
var loop=0;
var change=1;

// %% START ITERATION


var ce,c,dc, lmid,l1,l2,move,lmid ;


var SIMP1generation= function(){
    tic()
    
    console.log('It: ', loop)
    //     FE-ANALYSIS
    let temp1=add(mul(pow( transpose(colon(xPhys)), penal),E0-Emin),Emin);
    sK=reshape( mul(colon(KE),temp1), 64*nelx*nely,1); 
    K = sparse(iK,jK,sK,alldofs.length,alldofs.length);
    Kfree=get(K,freedofs,freedofs);
    Ffree=get(F,freedofs,[1]);
    
    // TESTING AN EXAMPLE
    inputF=transpose(Ffree);
    Ufree=mldivide(transpose(Kfree),inputF[0])
    U=new Array(alldofs.length).fill().map(x=>0);
    for (let i=0;i<freedofs.length; i++)
    {
        U[freedofs[i]-1]=Ufree[i];
    }
    U=transpose(U);
    
    //     %% OBJECTIVE FUNCTION AND SENSITIVITY ANALYSIS
    UedofMat = zeros(size(edofMat));
    for (let row = 0; row < UedofMat.length; row++) {
        for (let col = 0; col < UedofMat[0].length; col++) {
            UedofMat[row][col] = U[edofMat[row][col] - 1];
        }
    }
    ce=reshape( sum( dotmul(mul(UedofMat,KE),UedofMat) , 2), nely,nelx); // verified with matlab upto this point
    c= sum( sum(  dotmul(add (Emin, mul( pow(xPhys,penal),E0-Emin ) ) ,ce  ),1 ),2);
    console.log('compliance = '+c)
    c=c[0][0]; // converting single element matrix to a number
    dc =dotmul( mul(-penal*(E0-Emin),pow( xPhys,penal-1)) , ce);
    dv=ones(nely,nelx);
    
    //     OPTIMALITY CRITERIA UPDATE OF DESIGN VARIABLES AND PHYSICAL DENSITIES
    l1 = 0, l2 = 1e9, move = 0.2;
    
    updateDisplayedValues()
    
    
    whileloopcounter=0;
    while((l2-l1)/(l1+l2)>0.001){
        lmid = 0.5*(l2+l1);
        xnew= max(0,max(sub(x,move), min( 1, min( add(x,move) , dotmul(x, sqrt( mul(-1/lmid,dotdiv(dc,dv) )) ) ))))
        
        if (ft == 1){
            xPhys =deepcopy(xnew); //             xPhys = xnew;
        }
        else if (ft == 2){ //             xPhys(:) = (H*xnew(:))./Hs;
            var xPhyscolon = dotdiv(mul(H, colon(xnew)),Hs);
            
            let p=0;
            for (let col = 0; col < xPhys.length; col++) {
                for (let row = 0; row < xPhys.length; row++) {
                    xPhyscol=Math.floor(p/xPhys.length) ;
                    xPhysrow=p%xPhys.length;
                    xPhys[xPhysrow][xPhyscol]=xPhyscolon[p][0];
                    p++;
                }
            }
            
        }
        
        if (sum(colon(xPhys)) > volfrac*nelx*nely){ 
            l1 = lmid;  
        } else { 
            l2 = lmid;  
        }
        
        
        whileloopcounter++;
        if(whileloopcounter>100){
            break;
        }
        
    }
    
    
    change = max(abs( sub(colon(xnew),colon(x))  )  ,[],1)
    
    x=deepcopy(xnew)
    image(sub(1,x));
    loop++;
} 


var avgTimePerItr

function updateDisplayedValues(){
    let compliancebox=document.getElementById('compliancebox');
    compliancebox.innerText='c = '+c.toPrecision(4);
    
    let time =toc()
    
    if (loop==0){
        avgTimePerItr= time
    }else{
        avgTimePerItr = (avgTimePerItr*(loop+1)+time)/(loop+2)
    }
    let timebox=document.getElementById('timeperiteration');
    timebox.innerText='Time per itr. : '+avgTimePerItr.toPrecision(4) + ' s';
    
    let iterationbox=document.getElementById('iterations');
    iterationbox.innerText='Iterations : '+(loop+1).toString();
}


function computeAndUpdateCompliance(){
    tic()
    let temp1=add(mul(pow( transpose(colon(xPhys)), penal),E0-Emin),Emin);
    sK=reshape( mul(colon(KE),temp1), 64*nelx*nely,1); 
    K = sparse(iK,jK,sK,alldofs.length,alldofs.length);
    Kfree=get(K,freedofs,freedofs);
    Ffree=get(F,freedofs,[1]);
    
    // TESTING AN EXAMPLE
    inputF=transpose(Ffree);
    Ufree=mldivide(transpose(Kfree),inputF[0])
    U=new Array(alldofs.length).fill().map(x=>0);
    for (let i=0;i<freedofs.length; i++)
    {
        U[freedofs[i]-1]=Ufree[i];
    }
    U=transpose(U);
    
    //     %% OBJECTIVE FUNCTION AND SENSITIVITY ANALYSIS
    UedofMat = zeros(size(edofMat));
    for (let row = 0; row < UedofMat.length; row++) {
        for (let col = 0; col < UedofMat[0].length; col++) {
            UedofMat[row][col] = U[edofMat[row][col] - 1];
        }
    }
    ce=reshape( sum( dotmul(mul(UedofMat,KE),UedofMat) , 2), nely,nelx); // verified with matlab upto this point
    c= sum( sum(  dotmul(add (Emin, mul( pow(xPhys,penal),E0-Emin ) ) ,ce  ),1 ),2);
    console.log('compliance = '+c)
    c=c[0][0]; // converting single element matrix to a number
    dc =dotmul( mul(-penal*(E0-Emin),pow( xPhys,penal-1)) , ce);
    dv=ones(nely,nelx);
    
    //     OPTIMALITY CRITERIA UPDATE OF DESIGN VARIABLES AND PHYSICAL DENSITIES
    l1 = 0, l2 = 1e9, move = 0.2;
    
    updateDisplayedValues()
    
    
    
}

function SIMPreset(){
    let temp1 = concatCols(concatRows(A11,A12),concatRows(transpose(A12),A11));
    let temp2= concatCols(concatRows(B11,B12),concatRows(transpose(B12),B11));
    KE=mul(1/(1-nu**2)/24,  add(temp1,mul(temp2,nu))  );
    
    U = zeros(2*(nely+1)*(nelx+1),1);
    
    H=eye(nelx*nely);
    Hs=ones(nelx*nely,1);
    
    
    // %% INITIALIZE ITERATION
    x=repmat([[volfrac]],nely,nelx); // the double square bracket is because repmat first argument must be a matrix
    
    xPhys=deepcopy(x);
    loop=0;
    change=1;
    image(sub(1,x));

}