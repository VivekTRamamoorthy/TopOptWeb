// Mesh plotting function

function image(img){

        // LOADING CANVAS
        var canvas =document.querySelector('canvas');
        var c=canvas.getContext('2d');
        const nelx=img[0].length;
        const  nely=img.length;
        const pixelWidth=canvas.width/nelx;
        const pixelHeight=canvas.height/nely; 
        // PLOT SETTINGS
        c.lineWidth=1;
        c.font = "30px Arial ";

        // FOR EACH ELEMENT DRAW A RECTANGLE
        for(let i=0;i<nelx;i++){
                for(let j=0;j<nely;j++){
                        
                        color=Math.round(img[j][i]*255);


                        c.fillStyle='rgb('+color+',' +color+','+color+')' ; //  color
                        
                        let xcoord=i*canvas.width/nelx;
                        let ycoord=j*canvas.height/nely;
                        c.fillRect(xcoord,ycoord,pixelWidth,pixelHeight);
                        c.linestyle = '1px red';
                        c.strokeRect(xcoord,ycoord,pixelWidth,pixelHeight);

                }
        }
        return 0;
} 
