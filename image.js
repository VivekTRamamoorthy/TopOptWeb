// Mesh plotting function

function image(img){

        // LOADING CANVAS
        let canvas =document.querySelector('canvas');
        let c=canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        let nelx=img[0].length;
        let nely=img.length;
        let pixelWidth=canvas.width/nelx;
        let pixelHeight=canvas.height/nely; 
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
                        c.strokeRect(xcoord,ycoord,pixelWidth,pixelHeight);

                }
        }
        return 0;
} 
