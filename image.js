// Mesh plotting function

function image(img){
        
        // LOADING CANVAS
        var canvas =document.querySelector('canvas');
        // console.log(canvas)
        var c=canvas.getContext('2d');
        const nelx=img[0].length;
        const  nely=img.length;
        const pixelWidth=canvas.width/nelx;
        const pixelHeight=canvas.height/nely; 


        // FOR EACH ELEMENT DRAW A RECTANGLE
        for(let i=0;i<nelx;i++){
                for(let j=0;j<nely;j++){
                        
                        color=Math.round(img[i][j]*255)
                        // PLOT SETTINGS
                        c.lineWidth=3;
                        c.fillStyle="rgba(color,color,color,1)" ; //  color
                        
                        let x=i*canvas.width/nelx;
                        let y=j*canvas.height/nely;
                        c.fillRect(x,y,pixelWidth,pixelHeight);
                        c.strokeStyle = 'black';
                        c.strokeRect(x,y,pixelWidth,pixelHeight);
                }
        }
        
        return [];
} // end of function image
