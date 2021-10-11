		
// GENERATING THE MESH 

// creating and plotting the mesh
var nelx=5;
var nely=5;
var mesh={
		D:.1,
		d:.05,
		NELEMxL:5,
		NELEMxD:10,
		NELEMy:10,
		// coords:undefined,
		// connect:undefined,
		};



mesh.NELEM=(mesh.NELEMxD+mesh.NELEMxL)*mesh.NELEMy;
mesh.NNODE=(mesh.NELEMxD+mesh.NELEMxL+1)*(mesh.NELEMy+1);



// mesh.coords={x:[],y:[]};
mesh.coords=[[],[]];

mesh.connect=[];

let i=0,j=0,p=0;

// setting nodal coordinate array
for(i=0;i<mesh.NELEMy+1;i++){
	for(j=0;j<mesh.NELEMxD+mesh.NELEMxL+1;j++){
		p=i*(mesh.NELEMxD+mesh.NELEMxL+1)+j;
		// console.log({p,i,j})

		mesh.coords[0][p]=mesh.D/mesh.NELEMxD*j;
		mesh.coords[1][p]= mesh.d/mesh.NELEMy*i;

	}
}


mesh.domain=[];
mesh.matType=new Array(mesh.NELEM).fill(1);
mesh.genome=new Array(mesh.NELEMxD*mesh.NELEMy).fill(1);

p=0;
let node1, node2, node3, node4;
// setting element data array
for(i=0;i<mesh.NELEMy;i++){
	for(j=0;j<mesh.NELEMxL+mesh.NELEMxD;j++){
		      //   ENUM=ENUM+1;
        // % node number formulas
        // node1=(i-1)*(NELEMxL+NELEMxD+1)+j;
        // node2=(i-1)*(NELEMxL+NELEMxD+1)+j+1;
        // node3=(i)*(NELEMxL+NELEMxD+1)+j+1;
        // node4=(i)*(NELEMxL+NELEMxD+1)+j;
        // EDATA(ENUM,:)=[node1 node2 node3 node4 1];
        // if j>NELEMxL % if column is within porous region
        //     EDATA(ENUM,5)=2;
        // end

        node1=i*(mesh.NELEMxL+mesh.NELEMxD+1)+j;
        node2=i*(mesh.NELEMxL+mesh.NELEMxD+1)+j+1;
        node3=(i+1)*(mesh.NELEMxL+mesh.NELEMxD+1)+j+1;
        node4=(i+1)*(mesh.NELEMxL+mesh.NELEMxD+1)+j;
        mesh.connect[p]=[node1,node2,node3,node4];
        if (j>=mesh.NELEMxL){
        	mesh.domain.push(p);
        	mesh.matType[p]=2;
    	}else{
    		mesh.matType[p]=1;
    	}
    	// console.log({p,node1,node2,node3,node4})
        p=p+1;
	}
}

mesh.bc="symmetric";
mesh.sidebc="symmetric";


module.exports={mesh, frequences, mat};

// console.log({mesh})







