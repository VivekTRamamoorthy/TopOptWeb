
// This is a toolbox which simplifies development by allowing matlab like syntax in vanilla Javascript. 
// These functions are meant for syntax simplification rather than performance.
// Use equivalent typed code for speed.
// BASIC MATLAB  FUNCTIONS


var ndarrayToggle=0; // doesn't use ndarray functions for basic operations such as zeros, ones etc
var complexToggle=0; // doesn't use complex interpretations



var clc=function(){console.clear()};

var ticTime;


var tic= function(){
    const d = new Date();
    ticTime=d.getTime();
    return ticTime;    
    
}


var toc=function(){
    const d = new Date();
    var tocTime = d.getTime();
    const elTime=(tocTime-ticTime)/1000;
    console.log("Elapsed time is: "+ elTime + " secs" )
    return elTime;
    
}

var isfield=function(obj,fieldstr){return obj.hasOwnProperty(fieldstr)}

// ARRAY OPERATIONS

var size=function(a,dim=0){ // mimics matlabs size function size([10,10]) => [1,2]
    if(a.hasOwnProperty("stride")){return a.size;} // check for ndarray
    if(a instanceof Array){
        if(dim==0){
            if(a[0] instanceof Array){return [a[0].length,a.length];}
            return [1,a.length];
        }
        if(dim==1){return a.length;}
        if(dim==2){return a[0].length;}
    }
    console.error("cannot resolve the size of this object.")
    return [];
    
}


var find = function(array){
    let found=[];
    for (let i = 0; i < array.length; i++) {
        if(array[i]!=0){
            found.push(i);
        }
        
    }
    return found;
}


var sort=function(array){return array.sort((a,b)=>a-b)}

var abs=function(array){return array.map(x=>Math.abs(x))}

var setdiff=function(arr1,arr2){
    let result=[arr1[0]], indices=[1],donotinclude, current;
    for (let i = 1; i < arr1.length; i++) {
        current=arr1[i];
        donotinclude=0;
        // check to see if the current element exists in the result
        for (let j = 0; j < result.length; j++) {
            if(current==result[j]){donotinclude=1; break; }
        }
        if(donotinclude==1){break;}
        // check to see if the current element exists in the array 2
        for (let j = 0; j < arr2.length; j++) {
            if(current==arr2[j]){donotinclude=1;break; }
        }
        // if(donotinclude==1){break;}
        // if the element doesn't exist then push to the result and update the index
        if(donotinclude==0){result.push(current); indices.push(i); }
    }
    // return [result,indices] // alternative two output argument result
    result.sort((a,b)=>a-b);
    return result
}

var min=function(arr){return Math.min.apply(null,arr);}

var max=function(arr){return Math.max.apply(null,arr);}

var range=function(a,b,c=""){// 1:5 range(1,5) or  1:0.1:5 range(1,0.1,5) Matlab's colon and double colon
    let n,step;
    if(typeof(c)=="number"){step=b;n=Math.floor((c-a)/b)+1} // three inputs
    else {step=1;n=Math.max(Math.round((b-a)/step)+1,0);} // only two inputs
    if(n<1){return [];}
    return (new Array(n)).fill(0).map((x,i)=>a+i*step);
}

var ones=function(a,b=a){
    let rows,cols;
    if(typeof(a)== "object"){rows=a[0]; cols=a[1]; }; // if a is an array and a(2) is not 1
    if(typeof(a)== "number"){rows=a;cols=b;};
    if(cols!=1){
        return new Array(rows).fill(new Array(cols).fill(1))
        
        if (ndarrayToggle==1){
            return pool.ones([a,b]);
        }
    };
    return new Array(rows).fill(1);
}



var zeros=function(a,b=1){
    let rows,cols;
    if(a instanceof Array){rows=a[0]; cols=a[1]; }; // if a is an array and a(2) is not 1
    if(typeof(a)== "number"){rows=a;cols=b;};
    if(cols!=1){
        return new Array(rows).fill(new Array(cols).fill(0))
        
        if (ndarrayToggle==1){
            return pool.zeros([a,b]);
        }
    };
    return new Array(rows).fill(0);
}


var concatRows=function(A,B){
    if(A.length==B.length){
        let C=[];
        for(let row=0;row<A.length;row++){
            C[row]=A[row].concat(B[row]);
        }
        return C;}
        else{
            console.error("Dimensions of arrays being horizontally concatenated are not equal")
            return [];
        }
    }
    
    var concatCols=function(A,B){

        if(A[0].length==B[0].length){

            let C=A.concat(B);
            return C;
        }
        console.error("Dimensions of arrays being horizontally concatenated are not equal")
        return [];
    }
    
    
    var transpose=function(A){
        B=new Array(A[0].length).fill(new Array(A.length).fill(0));
        for(row=0;row<A[0].length;row++){
            B[row]=A.map((Arow)=> Arow[row]);
        }
        return B;
    }
    
    var ones=function(a,b=a){
        let rows,cols;
        if(typeof(a)== "object"){rows=a[0]; cols=a[1]; }; // if a is an array and a(2) is not 1
        if(typeof(a)== "number"){rows=a;cols=b;};
        if(cols!=1){
            return new Array(rows).fill(new Array(cols).fill(1))
            
            if (ndarrayToggle==1){
                return pool.ones([a,b]);
            }
        };
        return new Array(rows).fill(1);
    }
    
    var zeros=function(a,b=1){
        let rows,cols;
        if(a instanceof Array){rows=a[0]; cols=a[1]; }; // if a is an array and a(2) is not 1
        if(typeof(a)== "number"){rows=a;cols=b;};
        if(cols!=1){
            return new Array(rows).fill(new Array(cols).fill(0))
            
            if (ndarrayToggle==1){
                return pool.zeros([a,b]);
            }
        };
        return new Array(rows).fill(0);
    }
    
    var display=function(a){
        if(typeof(a)=="number"){ // a is number
            console.log(a)
            return 0;
        }
        if(a instanceof cx){ // a is complex
            console.log("ans:\n"+a.re+" + 1i*"+a.im); 
            return 0;
        }
        if(a instanceof Array){  // a is an array
            if(typeof(a[0])=="number"){ // a is a number array
                let displayText="\n [";
                for(let i=0;i<a.length;i++){displayText=displayText.concat("  "+ a[i]+"  ")}
                console.log(displayText+" ]");
                return 0;
            }
            if(a[0] instanceof cx){ // a is a complex array
                let displayText="\n [ ";
                for(let i=0;i<a.length;i++){displayText=displayText.concat("  "+a[i].re+" + 1i*"+a[i].im+"   ")}
                console.log(displayText+" ]");
                return 0;
            }        
            if(a[0] instanceof Array){ // a is a matrix
                let displayText="  \n";
                for(let i=0;i<a.length;i++){
                    for(let j=0;j<a[0].length;j++){
                        displayText=displayText.concat("  "+a[i][j]+"  ");
                    }
                    displayText=displayText.concat("\n");
                }
                displayText=displayText.concat("  \n ");
                console.log(displayText);
                return 0;
            }
        }
        if(a.hasOwnProperty("stride")){ // a is an ndarray
            var show=require("ndarray-show");
            let result=show(a);
            console.log(result);
            return result;
        }
         console.error("display cannot print this data");
         return 0;
    }
    
    
    var reshape=function(vec,rows,cols){

        if (vec.length==rows*cols){
            let mat=[];
            for(let row=0;row<rows;row++){
                let start=row*cols;
                let end=(row+1)*cols;
                mat[row]=vec.slice(start,end)
            }
            return mat;
        }else if(vec.length*vec[0].length==rows*cols){
            let mat=[];
            let p=0;
            for(let row=0; row<rows; row++){
                mat[row]=[];
                for(let col=0; col<cols; col++){
                    let vcols=vec[0].length;
                    let vrows=vec.length;
                    let vcol=p%vrows;
                    let vrow=Math.floor(p/vcols);
                    mat[row][col]=vec[vrow][vcol];
                    p++;
                }
            }
            return mat;
        }
        console.error("cannot perform reshape operation. Check matrix dimensions")
        console.error("vector length: ",vec.length,"  rows: ",rows,"  cols: ", cols )
        return [];
    }

    var get=function(mat,rrange,crange){



        if (rrange==':'){         
            rrange=range(1,mat.length);
        }
        rrange=rrange.map((x,i)=>{if(x<1){return mat.length-x;} return x});
        if (crange==':'){
            crange=range(1,mat[0].length);
        }
        crange=crange.map((x,i)=>{if(x<1){return mat[0].length-x;} return x});

        let res=[];

        let i=0, j=0;
        for(let ri=0;ri<rrange.length;ri++){
            res[i]=[];
            j=0;
            for(let ci=0;ci<crange.length; ci++){
                //  console.log({i,j,ri,ci})
                res[i][j]=mat[rrange[ri]-1][crange[ci]-1];
                j++;
            }
            i++

        }
        return res;

    }



    var repmat= function(mat,rows,cols){
        let mrows=mat.length;
        let mcols=mat[0].length;
        let res = new Array(mrows*rows).fill(  new Array(mcols*cols).fill(0)  );
        res= res.map((resrow,row)=>{ return resrow.map((reselem,col) =>{return mat[row%mrows][col%mcols]}) } );

        return res;


    }


    var kron= function(X,Y){ // Kronecker tensor product
        let xrows=X.length;
        let xcols=X[0].length;

        // first row
        let resrow=mul(X[0][0],Y);
        for(let col=1; col<xcols; col++){
            resrow=concatRows(resrow,mul(X[0][col],Y));
        }
        let res=resrow;
        // remaining rows
        for(let row=1;row<xrows;row++){
            let resrow=mul(X[row][0],Y); // first col
            for(let col=1; col<xcols; col++){ // remaining cols
                resrow=concatRows(resrow,mul(X[row][col],Y));
            }
            res=concatCols(res,resrow);
        }

        return res;
    }
    
    
    //
    //
    //
    //
    //
    //
    //
    // END OF BASIC FUNCTIONS
    
    
    
    
    
    // UNIVERSAL FUNCTIONS ADD, MUL, DIV and SUB, POW,
    
    class cx {
        constructor(a,b,dtype='polar'){
            this.re=a;
            this.im=b;
        }
        
    }
    if(ndarrayToggle==1 &complexToggle==1){
        
        
        
        
        var pool=require('ndarray-scratch');
        var ndarray = require('ndarray');
        var ops = require('ndarray-ops');
        var mldivide = require('ndarray-linear-solve');
        var imshow = require("ndarray-imshow");
        var array2ndarray=require("ndarray-pack");
        var ndarray2array=require("ndarray-unpack");
        var concatCols = require("ndarray-concat-cols");
        var concatRows = require("ndarray-concat-rows");
        
    }
    
    
    
    var add=function(a,b){ // universal add function, not fully supported for ndarray vs complex
        if(typeof(a)=="number"){ // a is number
            if (typeof(b)=="number"){return a+b}; //b is number
            if (b instanceof cx){return b.add(a)}; // b is complex
            if (b instanceof Array){ 
                if(typeof(b[0])=="number"){return b.map(x=>x+a)}; // b is number array
                if(b[0] instanceof cx){ return b.map(x=>x.add(a))}; // b is complex array
                if(b[0] instanceof Array){ return b.map((brow)=>brow.map((bij)=>bij+a))} // b is matrix
            }
            if (b.hasOwnProperty("stride")){ c=pool.zeros(b.shape);ops.adds(c,b,a); return c  }; // b is ndarray
        }
        if(a instanceof cx){ // a is complex
            if (b instanceof Array){return b.map(x=>a.add(x))}; // b is numeric or complex array 
            return a.add(b); // b is number or complex
            // no support for a is complex and b is ndarray 
        }
        if(a instanceof Array){  // a is an array
            if(typeof(a[0])=="number"){ // a is a number array
                if(typeof(b)=="number"){return a.map(x=>x+b);} // b is a number
                if(b instanceof cx){return a.map(x=>b.add(x));} // b is complex
                if(b instanceof Array) { 
                    if(typeof(b[0])=="number"){return a.map((x,i)=>x+b[i])};
                    if (b[0] instanceof cx) {return b.map((x,i)=>x.add(a[i]));}
                }
            }
            if(a[0] instanceof cx){ // a is a complex array
                if(b instanceof Array) {return a.map((x,i)=>x.add(b[i])); } // b is  array
                return a.map(x=>x.add(b)); //  b is number or complex
            }        
            if(a[0] instanceof Array){ // a is a matrix
                if(typeof(b)=="number"){return a.map(Arow=>Arow.map(Aij=>Aij+b));} // b is a number
                if(b instanceof cx){return a.map(Arow=>Arow.map(Aij=>b.add(Aij)))} // b is complex
                if(b instanceof Array && b[0] instanceof Array){ // b is a matrix
                    if(a.length==b.length & a[0].length==b[0].length){ // checking dimensions
                        return a.map((arow,row)=>arow.map((arowcol,col)=>arow[col]+b[row][col]))// a and b are matrices
                    }
                    else{ console.error("Matrix dimensions must agree"); return [] }
                }
            }
        }
        if(a.hasOwnProperty("stride")){ // a is an ndarray
            if(typeof(b)=="number"){c=pool.zeros(a.shape); ops.adds(c,a,b); return c;} // b is number
            if(b instanceof cx){let c={re:pool.zeros(a.shape),im:pool.zeros(a.shape)}; ops.adds(c.re,a,b.re);ops.addseq(c.im,b.im); return c;} // b is complex
            if(b instanceof Array){
                if(typeof(b[0])=="number"){c=pool.zeros(a.shape);ops.add(c,a,new ndarray(b)); return c;} // b is array
                if(b[0] instanceof cx){let c={re:pool.zeros(a.shape),im:new ndarray(b.map(x=>x.im))}; ops.add(c.re,a,new ndarray(b.map(x=>x.re))); return c;} // b is complex
            }
            if(b.hasOwnProperty("stride")){ 
                if (a.size[0]==b.size[0] && a.size[1]==b.size[1]){ console.error("matrix dimensions must agree")};
                c=pool.zeros(a.shape);ops.add(c,a,b); return a; 
            }
        }
        
        
        console.error("universal add has not been implemented for this use case");
        return "bulb";
        
    }
    
    
    
    var sub=function(a,b){ // universal add function, not fully supported for ndarray vs complex
        if(typeof(a)=="number"){ // a is number
            if (typeof(b)=="number"){return a-b}; //b is number
            if (b instanceof cx){return b.sub(a)}; // b is complex
            if (b instanceof Array){ 
                if(typeof(b[0])=="number"){return b.map(x=>a-x)}; // b is number array
                if(b[0] instanceof cx){ return b.map(x=>x.neg().add(a))}; // b is complex array
                if(b[0] instanceof Array){ return b.map((brow)=>brow.map((bij)=>a-bij))} // b is matrix
            }
            if (b.hasOwnProperty("stride")){ c=pool.zeros(b.shape);ops.subs(c,b,a); return c }; // b is ndarray
        }
        if(a instanceof cx){ // a is complex
            if (b instanceof Array){return b.map(x=>a.sub(x))}; // b is numeric or complex array 
            return a.sub(b); // b is number or complex
            // no support a is complex and b is ndarray 
        }
        if(a instanceof Array){  // a is an array
            if(typeof(a[0])=="number"){ // a is a number array
                if(typeof(b)=="number"){return a.map(x=>x-b);} // b is a number
                if(b instanceof cx){return a.map(x=>b.neg().add(x));} // b is complex
                if(b instanceof Array) { 
                    if(typeof(b[0])=="number"){return a.map((x,i)=>x-b[i])};
                    if (b[0] instanceof cx) {return b.map((x,i)=>x.neg().add(a[i]));}
                }
            }
            if(a[0] instanceof cx){ // a is a complex array
                if(b instanceof Array) {return a.map((x,i)=>x.sub(b[i])); } // b is  array
                return a.map(x=>x.sub(b)); //  b is number or complex
            }
            if(a[0] instanceof Array){ // a is a matrix
                if(typeof(b)=="number"){return a.map(Arow=>Arow.map(Aij=>Aij-b));} // b is a number
                if(b instanceof cx){return a.map(Arow=>Arow.map(Aij=>Aij.sub(b)))} // b is complex
                if(b instanceof Array && b[0] instanceof Array){ // b is a matrix
                    if(a.length==b.length & a[0].length==b[0].length){ // checking dimensions
                        return a.map((arow,row)=>arow.map((arowcol,col)=>arow[col]-b[row][col]))// a and b are matrices
                    }
                    else{ console.error("Matrix dimensions must agree"); return [] }
                }
            }        
        }
        if(a.hasOwnProperty("stride")){ // a is an ndarray
            if(typeof(b)=="number"){c=pool.zeros(a.shape); ops.subs(c,a,b); return c;} // b is number
            if(b instanceof cx){let c={re:pool.zeros(a.shape),im:pool.zeros(a.shape)}; ops.subs(c.re,a,b.re);ops.subseq(c.im,b.im); return c;} // b is complex
            if(b instanceof Array){
                if(typeof(b[0])=="number"){c=pool.zeros(a.shape);ops.sub(c,a,new ndarray(b)); return c;} // b is array
                if(b[0] instanceof cx){let c={re:pool.zeros(a.shape),im:new ndarray(b.map(x=>-x.im))}; ops.sub(c.re,a,new ndarray(b.map(x=>x.re))); return c;} // b is complex
            }                       // careful with the direct assignment of imaginary part of b to c.im
            if(b.hasOwnProperty("stride")){ 
                if (a.size[0]==b.size[0] && a.size[1]==b.size[1]){ console.error("matrix dimensions must agree")};
                c=pool.zeros(a.shape);ops.sub(c,a,b); return c ;
            }
        }
        console.error("universal sub has not been implemented for this use case");
        return "bulb";
        
    }
    
    // MULTIPLICATION UNIVERSAL
    
    var mul=function(a,b){ // universal add function, not fully supported for ndarray vs complex
        if(typeof(a)=="number"){ // a is number
            if (typeof(b)=="number"){return a*b}; //b is number
            if (b instanceof cx){return b.mul(a)}; // b is complex
            if (b instanceof Array){ 
                if(typeof(b[0])=="number"){return b.map(x=>a*x)}; // b is number array
                if(b[0] instanceof cx){ return b.map(x=>x.mul(a))}; // b is complex array
                if(b[0] instanceof Array){ return b.map((brow)=>brow.map((bij)=>a*bij))} // b is matrix
            }
            if (b.hasOwnProperty("stride")){ c=pool.ones(b.shape);ops.muls(c,b,a); return c }; // b is ndarray
        }
        if(a instanceof cx){ // a is complex
            if (b instanceof Array){return b.map(x=>a.mul(x))}; // b is numeric or complex array 
            return a.mul(b); // b is number or complex
            // no support a is complex and b is ndarray 
        }
        if(a instanceof Array){  // a is an array
            if(typeof(a[0])=="number"){ // a is a number array
                if(typeof(b)=="number"){return a.map(x=>x*b);} // b is a number
                if(b instanceof cx){return a.map(x=>b.mul(x));} // b is complex
                if(b instanceof Array) { 
                    if(typeof(b[0])=="number"){return a.map((x,i)=>x*b[i])};
                    if (b[0] instanceof cx) {return b.map((x,i)=>x.mul(a[i]));}
                }
            }
            if(a[0] instanceof cx){ // a is a complex array
                if(b instanceof Array) {return a.map((x,i)=>x.mul(b[i])); } // b is  array
                return a.map(x=>x.mul(b)); //  b is number or complex
            }        
            if(a[0] instanceof Array){ // a is a matrix
                if(typeof(b)=="number"){return a.map(Arow=>Arow.map(Aij=>Aij*b));} // b is a number
                if(b instanceof cx){return a.map(Arow=>Arow.map(Aij=>Aij.mul(b)))} // b is complex
                if(b instanceof Array && b[0] instanceof Array){ // b is a matrix
                    let c=new Array(a.length).fill(new Array(b[0].length).fill(0));
                    if(a[0].length==b.length){ // checking dimensions
                        
                        for(let row=0;row<a.length;row++){
                            for(let col=0;col<b[0].length;col++){
                                presum=a[row].map((arowcol,i)=>arowcol*b[i][col]);
                                display(presum)
                                c[row][col]=presum.reduce((a,b)=>a+b);
                                console.log({row,col,c})
                            }
                        }
                        return c; // matrix multiplication code
                    }
                    else{ console.error("Matrix dimensions do not agree"); return []; }
                }
            }
        }
        if(a.hasOwnProperty("stride")){ // a is an ndarray
            if(typeof(b)=="number"){c=pool.ones(a.shape); ops.muls(c,a,b); return c;} // b is number
            if(b instanceof cx){let c={re:pool.ones(a.shape),im:pool.ones(a.shape)}; ops.muls(c.re,a,b.re);ops.muls(c.im,a,b.im); return c;} // b is complex
            if(b instanceof Array){
                if(typeof(b[0])=="number"){c=pool.ones(a.shape);ops.mul(c,a,new ndarray(b)); return c;} // b is array
                if(b[0] instanceof cx){let c={re:new ndarray(b.map(x=>x.re)),im:new ndarray(b.map(x=>x.im))}; ops.muleq(c.re,a); ops.muleq(c.im,a);return c;} // b is complex
            }                       // careful with the direct assignment of imaginary part of b to c.im
            if(b.hasOwnProperty("stride")){ 
                if (a.size[0]==b.size[0] && a.size[1]==b.size[1]){ console.error("matrix dimensions must agree")};
                c=pool.ones(a.shape);ops.mul(c,a,b); return c;
            }
        }
        console.error("universal multiply has not been implemented for this use case");
        return "bulb";
        
    }
    
    
    
    // UNIVERSAL DIVISION
    
    var div=function(a,b){ // universal add function, not fully supported for ndarray vs complex
        if(typeof(a)=="number"){ // a is number
            if (typeof(b)=="number"){return a*b}; //b is number
            if (b instanceof cx){return b.div(a)}; // b is complex
            if (b instanceof Array){ 
                if(typeof(b[0])=="number"){return b.map(x=>a/x)}; // b is number array
                if(b[0] instanceof cx){ return b.map(x=>x.inv().mul(a))}; // b is complex array
                if(b[0] instanceof Array){ return b.map((brow)=>brow.map((bij)=>a/bij))} // b is matrix
            }
            if (b.hasOwnProperty("stride")){ c=pool.ones(b.shape);ops.divs(c,b,a); return c }; // b is ndarray
        }
        if(a instanceof cx){ // a is complex
            if (b instanceof Array){return b.map(x=>a.div(x))}; // b is numeric or complex array 
            return a.div(b); // b is number or complex
            // no support a is complex and b is ndarray 
        }
        if(a instanceof Array){  // a is an array
            if(typeof(a[0])=="number"){ // a is a number array
                if(typeof(b)=="number"){return a.map(x=>x/b);} // b is a number
                if(b instanceof cx){return a.map(x=>b.inv().mul(x));} // b is complex
                if(b instanceof Array) { 
                    if(typeof(b[0])=="number"){return a.map((x,i)=>x/b[i])};
                    if (b[0] instanceof cx) {return b.map((x,i)=>x.inv().mul(a[i]));}
                }
            }
            if(a[0] instanceof cx){ // a is a complex array
                if(b instanceof Array) {return a.map((x,i)=>x.div(b[i])); } // b is  array
                return a.map(x=>x.mul(b)); //  b is number or complex
            }        
        }
        if(a.hasOwnProperty("stride")){ // a is an ndarray
            if(typeof(b)=="number"){c=pool.ones(a.shape); ops.divs(c,a,b); return c;} // b is number
            if(b instanceof cx){let c={re:pool.ones(a.shape),im:pool.ones(a.shape)}; ops.muls(c.re,a,(b.inv()).re);ops.muls(c.im,a,(b.inv()).im); return c;} // b is complex
            if(b instanceof Array){
                if(typeof(b[0])=="number"){c=pool.ones(a.shape);ops.div(c,a,new ndarray(b)); return c;} // b is array
                if(b[0] instanceof cx){let c={re:new ndarray(b.map(x=>(x.inv()).re)),im:new ndarray(b.map(x=>(x.inv()).im))}; ops.muleq(c.re,a); ops.muleq(c.im,a);return c;} // b is complex
            }                       // careful with the direct assignment of imaginary part of b to c.im
            if(b.hasOwnProperty("stride")){ 
                if (a.size[0]==b.size[0] && a.size[1]==b.size[1]){ console.error("matrix dimensions must agree")};
                c=pool.ones(a.shape);ops.div(c,a,b); return c;
            }
        }
        console.error("universal div has not been implemented for this use case");
        return "bulb";
        
    }
    
    
    // UNIVERSAL POW
    var pow=function(a,b){ // universal add function, not fully supported for ndarray vs complex
        if(typeof(a)=="number"){ // a is number
            if (typeof(b)=="number"){return a**b}; //b is number
            if (b instanceof cx){return (new cx(a,0)).pow(b)}; // b is complex
            if (b instanceof Array){ 
                if(typeof(b[0])=="number"){return b.map(x=>a**x)}; // b is number array
                if(b[0] instanceof cx){ return b.map(x=>(new cx(a,0)).pow(x));}; // b is complex array
                if(b[0] instanceof Array){ return b.map((brow)=>brow.map((bij)=>a**bij))} // b is matrix
            }
            if (b.hasOwnProperty("stride")){ c=new ndarray(b.data.map(x=>a**x)); return c }; // b is ndarray
        }
        if(a instanceof cx){ // a is complex
            if (b instanceof Array){return b.map(x=>a.pow(x))}; // b is numeric or complex array 
            return a.pow(b); // b is number or complex
            // no support a is complex and b is ndarray 
        }
        if(a instanceof Array){  // a is an array
            if(typeof(a[0])=="number"){ // a is a number array
                if(typeof(b)=="number"){return a.map(x=>x**b);} // b is a number
                if(b instanceof cx){return a.map(x=>(new cx(x,0)).pow(b));} // b is complex
                if(b instanceof Array) { 
                    if(typeof(b[0])=="number"){return a.map((x,i)=>x**b[i])};
                    if (b[0] instanceof cx) {return a.map((x,i)=>(new cx(x,0)).pow(b[i]));}
                }
            }
            if(a[0] instanceof cx){ // a is a complex array
                if(b instanceof Array) {return a.map((x,i)=>x.pow(b[i])); } // b is  array
                return a.map(x=>x.pow(b)); //  b is number or complex
            }        
        }
        if(a.hasOwnProperty("stride")){ // a is an ndarray
            if(typeof(b)=="number"){return new ndarray( a.data.map(x=>x**b) ); } // b is number
            if(b instanceof cx){
                let c={
                    re: new ndarray(a.data.map(x=>  ((new cx(x,0)).pow(b)).re ) ),
                    im: new ndarray(a.data.map(x=> ((new cx(x,0)).pow(b)).im ) )
                } ;
                return c;
            } // b is complex
            if(b instanceof Array){
                if(typeof(b[0])=="number"){
                    c=new ndarray(   a.data.map((x,i)=> x**b[i])   ); 
                    return c;
                } // b is array
                if(b[0] instanceof cx){
                    let c={
                        re:new ndarray(a.data.map((x,i)=> ((new cx(x.re,0)).pow(b[i])).re  )  ),
                        im:new ndarray(a.data.map((x,i)=> ((new cx(x.re,0)).pow(b[i])).im  )  ),
                    }; 
                    return c;
                } // b is complex
            }                       // careful with the direct assignment of imaginary part of b to c.im
            if(b.hasOwnProperty("stride")){ 
                if (a.size[0]==b.size[0] && a.size[1]==b.size[1]){ console.error("matrix dimensions must agree"); return "null"};
                return new ndarray(  a.data.map((x,i)=> x**b.data[i])  );
            } // b is complex
        }
        console.error("universal pow has not been implemented for this use case");
        return "bulb";
        
    } 
    
    
    
    // module.exports ={tic, toc,  isfield, size, setdiff, min, max ,find, sort, abs, range,
    // pool, ones, zeros, display ,ndarray, ops, mldivide ,imshow, array2ndarray, ndarray2array, concatCols, concatRows,
    // cx, add, sub, mul, div, pow }
    
    
    // MATLAB	JavaScript	Notes http://scijs.net/packages/#scijs/scijs-ndarray-for-matlab-users
    // ndims(a)	a.dimension	get the number of dimensions of a
    // numel(a)	a.size	get the number of elements of an arary
    // size(a)	a.shape	get the size of the array
    // size(a,n)	a.shape[n-1]	get the number of elements of the n-th dimension of array a
    // [1 2 3; 4 5 6 ]	ndarray([1,2,3,4,5,6],[2,3])	2×3 matrix literal (using Array type)
    // ndarray(new Float64Array([1,2,3,4,5,6]),[2,3])	2×3 matrix literal (using 64-bit typed array)	
    // pack([[1,2,3],[4,5,6]])	2×3 matrix literal from nested array	
    // a(end)	a.get(a.shape[0]-1)	access last element in the 1×n matrix a
    // a(2, 5)	a.get(1, 4)	access element in second row, fifth column
    // a(2, :)	a.pick(1, null)	entire second row of a
    // a(1:5, :)	a.hi(5, null)	the first five rows of a
    // a(end-4:end, :)	a.lo(a.shape[0]-5, null)	the last five rows of a
    // a(1:3, 5:9)	a.hi(3, 9).lo(0, 4)	rows one to three and columns five to nine of a
    // a([2, 4, 5], [1, 3])		rows 2, 4, and 5 and columns 1 and 3.
    // a(3:2:21, :)	a.hi(21, null).lo(2, null).step(2, 1)	every other row of a, starting with the third and going to the twenty-first
    // a(1:2:end, :)	a.step(2, 1)	every other row of a, starting with the first
    // a(end:-1:1, :) or flipup(a)	a.step(-1, 1)	a with rows in reverse order
    // a([1:end 1], :)		a with copy of the first rows appended to the end
    // a.'	a.transpose(1, 0)	transpose of a
    // a'		conjugate transpose of a
    // c = a * b	gemm(c, a, b)	matrix multiply
    // c = a + b	ops.add(c, a, b)	matrix addition
    // c = a + 2	ops.adds(c, a, 2)	matrix + scalar addition
    // a += b (not available in MATLAB)	ops.addeq(a, b)	in-place matrix addition
    // c = a .* b	ops.mul(c, a, b)	element-wise multiply
    // a = a .* b	ops.muleq(a, b)	element-wise multiply (in-place)
    // c = a ./ b	ops.div(c, a, b)	element-wise division
    // a = a ./ b	ops.diveq(a, b)	element-wise division (in-place)
    // a.^3	ops.pows(a, 3)	element-wise scalar exponentiation
    // (a>0.5)		matrix whose i,jth element is (a_ij > 0.5)
    // find(a>0.5)		find the indices where (a > 0.5)
    // a(:, find(v>0.5))		extract the columns of a where vector v > 0.5
    // a(a<0.5)=0		a with elements less than 0.5 zeroed out
    // a .* (a>0.5)		a with elements less than 0.5 zeroed out
    // a(:) = 3	ops.assigns(a, 3)	set all values to the same scalar value
    // y = x	y =pool.clone(x)	clone by value
    // y = x(2, :)	y = x.pick(1, null)	slices are by reference
    // 1:10		create an increasing vector
    // 0:9		create an increasing vector
    // zeros(3, 4)	pool.zeros([3, 4], 'float64')	3×4 rand-2 array full of 64-bit floating point zeros
    // zeros(3, 4, 5)	pool.zeros([3, 4, 5], 'float64')	3×4×5 rank-3 array full of 64-bit floating point zeros
    // ones(3, 4)	pool.ones([3, 4], 'float64')	3×4 rank-2 array full of 64-bit floating point ones
    // eye(3)	pool.eye([3, 3], 'float64')	3×3 identity matrix with 64-bit floating point precision
    // diag(a)	diag(a)	vector of diagonal elements of a (returns diagonal by reference)
    // diag(a, 0)	b =pool.zeros(a.shape)
    // ops.assign(diag(b),diag(a))	square diagonal matrix whose nonzero values are the elements of a
    // rand(3, 4)	fill(pool.zeros([3, 4]), Math.random)	random 3×4 matrix
    // linspace(1, 3, 4)	linspace(1, 3, 4)	4 equally spaced samples between 1 and 3, inclusive
    // [x, y] = meshgrid(0:8, 0:5)		two 2D arrays: one of x values, one of y values
    // [x, y] = meshgrid([1, 2, 4], [2, 4, 5])		
    // repmat(a, m, n)	tile(a, [m, n])	create m×n copies of a
    // [a b]	concatCols([a, b])	concatenate columns of a and b
    // [a; b]	concatRows([a, b])	concatenate rows of a and b
    // max(max(a))		maximum element of a
    // max(a)	ops.max(a)	maximum element in a
    // norm(v)	ops.norm2(v)	L2 norm of vector v
    // c = a & b	ops.band(c, a, b)	element-by-element AND operator
    // c = a	b	ops.bor(c, a, b)	element-by-element OR operator
    // inv(a)		inverse of square matrix a
    // pinv(a)		pseudo-inverse of matrix a
    // rank(a)		rank of matrix a
    // a\b	lup(a, a, P)
    // solve(a, a, P, b)	solution of a x = b for x
    // b/a		solution of x a = b for x
    // chol(a)	chol(a, L)	cholesky factorization of matrix
    // [V, D] = eig(a)		eigenvalues and eigenvectors of a
    // [V, D] = eig(a, b)		eigenvalues and eigenvectors of a, b
    // [Q, R, P] = qr(a, 0)	qr.factor(A, d)
    // qr.constructQ(A, Q)	QR decomposition. (Depending on the use, you can likely use Q without constructing explicitly. See documentation.)
    // [L, U, P] = lu(a)	lup(A, L, P)	LU decomposition
    // fft(a)	fft(1, ar, ai)	Fourier transform of a. Javascript does not have a complex type so real and imaginary parts must be passed separately.
    // ifft(a)	fft(-1, ar, ai)	inverse Fourier transform of a
    // [b, I] = sortrows(a, i)	sort(a)	sort the rows of the matrix
    // sort(a.transpose(1, 0))	sort the column of the matrix	
    // regress(y, X)	qr.factor( A, d );
    // qr.solve( A, d, y );	multilinear regression
    // decimate(x, q)	resample(output, input)	downsample with low-pass filtering (resample downsamples by a factor of two)
    // unique		
    // squeeze(a)	squeeze(a)	Remove singleton dimensions of a
    
    
    
