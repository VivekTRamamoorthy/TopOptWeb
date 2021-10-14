// PLOTTING A SAMPLE MESH

// SAMPLE SHAPE
tic()


// 99 line matalab code

// %%%% AN 88 LINE TOPOLOGY OPTIMIZATION CODE %%%%
// % function top88(nelx,nely,volfrac,penal,rmin,ft)
// % top88(100,100,0.5,1,1,2)

// nelx=100;nely=100;volfrac=0.3;penal=2;rmin=1;ft=2;
const nelx=10,nely=10, volfrac=0.3,penal=2,rmin=1,ft=2;
var x=mul(0.5,zeros(nelx,nely))
image(x);

// %% MATERIAL PROPERTIES
// E0 = 1;
// Emin = 1e-9;
// nu = 0.3;
const E0 = 1;
const Emin = 1e-9;
const nu = 0.3;

// %% PREPARE FINITE ELEMENT ANALYSIS
// A11 = [12 3 -6 -3; 3 12 3 0; -6 3 12 -3; -3 0 -3 12];
// A12 = [-6 -3 0 3; -3 -6 -3 -6; 0 -3 -6 3; 3 -6 3 -6];
// B11 = [-4 3 -2 9; 3 -4 -9 4; -2 -9 -4 -3; 9 4 -3 -4];
// B12 = [ 2 -3 4 -9; -3 2 9 -2; 4 9 2 3; -9 -2 3 2];
const A11 = [[12, 3, -6, -3], [3, 12, 3, 0], [-6, 3, 12, -3], [-3, 0, -3, 12]];
const A12 = [[-6, -3, 0, 3],[ -3, -6, -3, -6],[ 0, -3, -6, 3],[ 3 ,-6 ,3 ,-6]];
const B11 = [[-4, 3, -2, 9],[ 3, -4, -9, 4],[ -2, -9, -4, -3],[ 9, 4, -3 ,-4]];
const B12 = [[ 2, -3, 4, -9],[ -3, 2, 9, -2],[ 4, 9 ,2 ,3],[ -9, -2, 3, 2]];



// KE = 1/(1-nu^2)/24*([A11 A12;A12' A11]+nu*[B11 B12;B12' B11]);
var temp1 = concatCols(concatRows(A11,A12),concatRows(transpose(A12),A11));
var temp2= concatCols(concatRows(B11,B12),concatRows(transpose(B12),B11));

KE=mul(1/(1-nu**2)/24,  add(temp1,mul(temp2,nu))  );



// nodenrs = reshape(1:(1+nelx)*(1+nely),1+nely,1+nelx);

var nodenrs = reshape([range(1,(1+nelx)*(1+nely))],1+nely,1+nelx )

// edofVec = reshape(2*nodenrs(1:end-1,1:end-1)+1,nelx*nely,1);
temp1= add(1,mul(2, get(nodenrs,range(1,nodenrs.length-1),range(1,nodenrs[0].length-1) ) ))
var edofVec =  reshape(temp1,nelx*nely,1);

// edofMat = repmat(edofVec,1,8)+repmat([0 1 2*nely+[2 3 0 1] -2 -1],nelx*nely,1);
temp1 = repmat(edofVec,1,8);
temp2=repmat([[0, 1, 2*nely+2, 2*nely+3, 2*nely+0,2*nely+1, -2, -1]],nelx*nely,1);
var edofMat = add(temp1,temp2)

// display(edofMat)


// iK = reshape(kron(edofMat,ones(8,1))',64*nelx*nely,1);

var iK= reshape(transpose(kron(edofMat,ones(8,1))) , 64*nelx*nely,1)

// jK = reshape(kron(edofMat,ones(1,8))',64*nelx*nely,1);

var jK= reshape(transpose(kron(edofMat,ones(1,8))) , 64*nelx*nely,1)

// % DEFINE LOADS AND SUPPORTS (HALF MBB-BEAM)

// F = sparse(2,1,-1,2*(nely+1)*(nelx+1),1);

var F=zeros(2*(nely+1)*(nelx+1),1)
F[1]=[-1];


// U = zeros(2*(nely+1)*(nelx+1),1);

var U = zeros(2*(nely+1)*(nelx+1),1);

// fixeddofs = union([1:2:2*(nely+1)],[2*(nelx+1)*(nely+1)]);

fixeddofs = union(range(1,2,2*(nely+1)),2*(nelx+1)*(nely+1));


// alldofs = [1:2*(nely+1)*(nelx+1)];

var alldofs = range(1,2*(nely+1)*(nelx+1));

// freedofs = setdiff(alldofs,fixeddofs);

var freedofs = setdiff(alldofs,fixeddofs);


// %% PREPARE FILTER
// iH = ones(nelx*nely*(2*(ceil(rmin)-1)+1)^2,1);
// jH = ones(size(iH));
// sH = zeros(size(iH));
// k = 0;
// for i1 = 1:nelx
//     for j1 = 1:nely
//         e1 = (i1-1)*nely+j1;
//         for i2 = max(i1-(ceil(rmin)-1),1):min(i1+(ceil(rmin)-1),nelx)
//             for j2 = max(j1-(ceil(rmin)-1),1):min(j1+(ceil(rmin)-1),nely)
//                 e2 = (i2-1)*nely+j2;
//                 k = k+1;
//                 iH(k) = e1;
//                 jH(k) = e2;
//                 sH(k) = max(0,rmin-sqrt((i1-i2)^2+(j1-j2)^2));
//             end
//         end
//     end
// end
// H = sparse(iH,jH,sH);
// Hs = sum(H,2);

var H=eye(nelx*nely);
var Hs=ones(nelx*nely,1);


// %% INITIALIZE ITERATION
// x = repmat(volfrac,nely,nelx);

x=repmat([[volfrac]],nely,nelx); // the double square bracket is because repmat first input must be a matrix


// xPhys = x;
var xPhys=[...x];
// loop = 0;
var loop=0;
// change = 1;
var change=1;


// %% START ITERATION

// while change > 0.01

var ce,c,dc, lmid,l1,l2,move,lmid ;


var SIMPloop= function(){
//     loop = loop + 1;

//     %% FE-ANALYSIS
//     sK = reshape(KE(:)*(Emin+xPhys(:)'.^penal*(E0-Emin)),64*nelx*nely,1); // this is to input in sparse

temp1=add(mul(pow( transpose(colon(xPhys)), penal),E0-Emin),Emin);
// display(mul(colon(KE),temp1))
sK=reshape( mul(colon(KE),temp1), 64*nelx*nely,1);

//     K = sparse(iK,jK,sK); K = (K+K')/2;

K = sparse(iK,jK,sK,alldofs.length,alldofs.length);

//     U(freedofs) = K(freedofs,freedofs)\F(freedofs);
Kfree=get(K,freedofs,freedofs);
Ffree=get(F,freedofs,[1]);
// Ufree=mul(math.inv(Kfree),Ffree); // doesnt work matrix is singular

// TESTING AN EXAMPLE


// var upA= [[ 2, 1, -1],[ -3, -1, 2],[ -2, 1, 2 ]] // should be read as packed vectors

// var upB= [ -3 ,1, 3]

// var X=mldivide(upA,upB);
inputF=transpose(Ffree);
Ufree=mldivide(transpose(Kfree),inputF[0])

U=new Array(alldofs.length).fill().map(x=>0);
for (let i=0;i<freedofs.length; i++)
{
    U[freedofs[i]-1]=Ufree[i];
}
U=transpose(U);


//     %% OBJECTIVE FUNCTION AND SENSITIVITY ANALYSIS

//     ce = reshape(sum(  (U(edofMat)*KE).*U(edofMat),2  )    ,nely,nelx);

UedofMat = zeros(size(edofMat));

for (let row = 0; row < UedofMat.length; row++) {
    for (let col = 0; col < UedofMat[0].length; col++) {
         UedofMat[row][col] = U[edofMat[row][col] - 1];
        
    }
    
}





// ce = reshape(sum(  (U(edofMat)*KE).*U(edofMat),2  )    ,nely,nelx);

ce=reshape( sum( dotmul(mul(UedofMat,KE),UedofMat) , 2), nely,nelx); // verified with matlab upto this point



//     c = sum(sum((Emin+xPhys.^penal*(E0-Emin)).*ce))

c= sum( sum(  dotmul(add (Emin, mul( pow(xPhys,penal),E0-Emin ) ) ,ce  ),1 ),2);

c=c[0][0]; // converting single element matrix to a number

//     dc = -penal*(E0-Emin)*xPhys.^(penal-1).*ce;

dc =dotmul( mul(-penal*(E0-Emin),pow( xPhys,penal-1)) , ce);


//     dv = ones(nely,nelx);

dv=ones(nely,nelx);
//     %% FILTERING/MODIFICATION OF SENSITIVITIES
//     if ft == 1
//         dc(:) = H*(x(:).*dc(:))./Hs./max(1e-3,x(:));
//     elseif ft == 2
//         dc(:) = H*(dc(:)./Hs);
//         dv(:) = H*(dv(:)./Hs);
//     end
//     %% OPTIMALITY CRITERIA UPDATE OF DESIGN VARIABLES AND PHYSICAL DENSITIES
//     l1 = 0; l2 = 1e9; move = 0.2;
l1 = 0, l2 = 1e9, move = 0.2;
compliancebox=document.getElementById('compliancebox');
compliancebox.innerHTML='c = '+c;
//     while (l2-l1)/(l1+l2) > 1e-3
whileloopcounter=0;

console.log("Verified upto this line")

while((l2-l1)/(l1+l2)>0.001){


//         lmid = 0.5*(l2+l1);
lmid = 0.5*(l2+l1);
//         xnew = max(0,max(x-move,min(1,min(x+move,x.*sqrt(-dc./dv/lmid)))));

//  var xnew= min (  add(x,move) , dotmul(x, sqrt( mul(-1/lmid,dotdiv(dc,dv) )   )) )
xnew= max(0,max(sub(x,move), min( 1, min( add(x,move) , dotmul(x, sqrt( mul(-1/lmid,dotdiv(dc,dv) )) ) ))))

//         if ft == 1
//             xPhys = xnew;
//         elseif ft == 2
//             xPhys(:) = (H*xnew(:))./Hs;
//         end

        if (ft == 1){
            xPhys =[...xnew]; //             xPhys = xnew;
        }
        else if (ft == 2){ //             xPhys(:) = (H*xnew(:))./Hs;
            var xPhyscolon = dotdiv(mul(H, colon(xnew)),Hs);
            let p=0;
            for (let col = 0; col < xPhys.length; col++) {
                for (let row = 0; row < xPhys.length; row++) {
                    xPhyscol=p%xPhys.length;
                    xPhysrow=Math.floor(p/xPhys.length);
                    xPhys[xPhysrow][xPhyscol]=xPhyscolon[p][0];
                    p++;
                }
            }
        }

//         if sum(xPhys(:)) > volfrac*nelx*nely, l1 = lmid; else l2 = lmid; end

if (sum(colon(xPhys)) > volfrac*nelx*nely){
 l1 = lmid; 
}
else{ l2 = lmid;
}

whileloopcounter++;
if(whileloopcounter>100){
break;
}

//     end
}

//     change = max(abs(xnew(:)-x(:)));
change = max(transpose(abs( sub(colon(xnew),colon(x))   )))
//     x = xnew;
x=xnew;
//     %% PRINT RESULTS
//     fprintf(' It.:%5i Obj.:%11.4f Vol.:%7.3f ch.:%7.3f\n',loop,c, ...
//         mean(xPhys(:)),change);
console.log('It: ', loop)
//     %% PLOT DENSITIES
//     colormap(gray); imagesc(1-xPhys); caxis([0 1]); axis equal; axis off; drawnow;
// end
image(sub(1,x));
loop++;
console.log('SIMP ',loop,' iteration')
} // end of for loop


SIMPloop();


    



     
    
//solver
// 99 line matlab code

// %%%% AN 88 LINE TOPOLOGY OPTIMIZATION CODE %%%%
// % function top88(nelx,nely,volfrac,penal,rmin,ft)
// % top88(100,100,0.5,1,1,2)

// nelx=100;nely=100;volfrac=0.3;penal=2;rmin=1;ft=2;
// %% MATERIAL PROPERTIES
// E0 = 1;
// Emin = 1e-9;
// nu = 0.3;
// %% PREPARE FINITE ELEMENT ANALYSIS
// A11 = [12 3 -6 -3; 3 12 3 0; -6 3 12 -3; -3 0 -3 12];
// A12 = [-6 -3 0 3; -3 -6 -3 -6; 0 -3 -6 3; 3 -6 3 -6];
// B11 = [-4 3 -2 9; 3 -4 -9 4; -2 -9 -4 -3; 9 4 -3 -4];
// B12 = [ 2 -3 4 -9; -3 2 9 -2; 4 9 2 3; -9 -2 3 2];
// KE = 1/(1-nu^2)/24*([A11 A12;A12' A11]+nu*[B11 B12;B12' B11]);
// nodenrs = reshape(1:(1+nelx)*(1+nely),1+nely,1+nelx);
// edofVec = reshape(2*nodenrs(1:end-1,1:end-1)+1,nelx*nely,1);
// edofMat = repmat(edofVec,1,8)+repmat([0 1 2*nely+[2 3 0 1] -2 -1],nelx*nely,1);
// iK = reshape(kron(edofMat,ones(8,1))',64*nelx*nely,1);
// jK = reshape(kron(edofMat,ones(1,8))',64*nelx*nely,1);
// % DEFINE LOADS AND SUPPORTS (HALF MBB-BEAM)
// F = sparse(2,1,-1,2*(nely+1)*(nelx+1),1);
// U = zeros(2*(nely+1)*(nelx+1),1);
// fixeddofs = union([1:2:2*(nely+1)],[2*(nelx+1)*(nely+1)]);
// alldofs = [1:2*(nely+1)*(nelx+1)];
// freedofs = setdiff(alldofs,fixeddofs);
// %% PREPARE FILTER
// iH = ones(nelx*nely*(2*(ceil(rmin)-1)+1)^2,1);
// jH = ones(size(iH));
// sH = zeros(size(iH));
// k = 0;
// for i1 = 1:nelx
//     for j1 = 1:nely
//         e1 = (i1-1)*nely+j1;
//         for i2 = max(i1-(ceil(rmin)-1),1):min(i1+(ceil(rmin)-1),nelx)
//             for j2 = max(j1-(ceil(rmin)-1),1):min(j1+(ceil(rmin)-1),nely)
//                 e2 = (i2-1)*nely+j2;
//                 k = k+1;
//                 iH(k) = e1;
//                 jH(k) = e2;
//                 sH(k) = max(0,rmin-sqrt((i1-i2)^2+(j1-j2)^2));
//             end
//         end
//     end
// end
// H = sparse(iH,jH,sH);
// Hs = sum(H,2);
// %% INITIALIZE ITERATION
// x = repmat(volfrac,nely,nelx);
// xPhys = x;
// loop = 0;
// change = 1;
// %% START ITERATION
// while change > 0.01
//     loop = loop + 1;
//     %% FE-ANALYSIS
//     sK = reshape(KE(:)*(Emin+xPhys(:)'.^penal*(E0-Emin)),64*nelx*nely,1);
//     K = sparse(iK,jK,sK); K = (K+K')/2;
//     U(freedofs) = K(freedofs,freedofs)\F(freedofs);
//     %% OBJECTIVE FUNCTION AND SENSITIVITY ANALYSIS
//     ce = reshape(sum((U(edofMat)*KE).*U(edofMat),2),nely,nelx);
//     c = sum(sum((Emin+xPhys.^penal*(E0-Emin)).*ce))
//     dc = -penal*(E0-Emin)*xPhys.^(penal-1).*ce;
//     dv = ones(nely,nelx);
//     %% FILTERING/MODIFICATION OF SENSITIVITIES
//     if ft == 1
//         dc(:) = H*(x(:).*dc(:))./Hs./max(1e-3,x(:));
//     elseif ft == 2
//         dc(:) = H*(dc(:)./Hs);
//         dv(:) = H*(dv(:)./Hs);
//     end
//     %% OPTIMALITY CRITERIA UPDATE OF DESIGN VARIABLES AND PHYSICAL DENSITIES
//     l1 = 0; l2 = 1e9; move = 0.2;
//     while (l2-l1)/(l1+l2) > 1e-3
//         lmid = 0.5*(l2+l1);
//         xnew = max(0,max(x-move,min(1,min(x+move,x.*sqrt(-dc./dv/lmid)))));
//         if ft == 1
//             xPhys = xnew;
//         elseif ft == 2
//             xPhys(:) = (H*xnew(:))./Hs;
//         end
//         if sum(xPhys(:)) > volfrac*nelx*nely, l1 = lmid; else l2 = lmid; end
//     end
//     change = max(abs(xnew(:)-x(:)));
//     x = xnew;
//     %% PRINT RESULTS
//     fprintf(' It.:%5i Obj.:%11.4f Vol.:%7.3f ch.:%7.3f\n',loop,c, ...
//         mean(xPhys(:)),change);
//     %% PLOT DENSITIES
//     colormap(gray); imagesc(1-xPhys); caxis([0 1]); axis equal; axis off; drawnow;
// end




// % end







toc()



