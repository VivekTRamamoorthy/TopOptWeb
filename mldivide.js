var mldivide = function (A, B) {
    //Validate inputs
    if (!A[0] instanceof Array) throw new Error('not a 2-dimensional matrix');
    // var m = A.shape[0], n = A.shape[1];
    var m = A.length, n = A[0].length;
    // if (m !== n) throw new Error('not a square matrix: ' + m + 'x' + n);
    // if (B.length[0] !== 1) throw new Error('B is not a vector');
    // if (B.shape[0] !== m) throw new Error('B has an invalid length');
    // if (X.dimension !== 1) throw new Error('X is not a vector');
    // if (X.shape[0] !== m) throw new Error('X has an invalid length');
    
    //TODO: Implement other solvers based on the format of M
    //
    //  Would be nice to have:
    //
    //      * QR factorization for rectangular matrices
    //      * Cholesky/LDL solver for positive semidefinite matrices
    //      * Sparse solvers
    //      
    let X= zeros(B.length,1) ;
    let r= denseGeneralSolve(m, X, A, B)

    
    // upA=transpose(upA);
    // upB=transpose(upB);

    // let A=pack(upA);
    // let B=pack(upB);
 
    // r=solve(X, A, B)
    // console.log('input:\n' + show(A), '\n');
    // console.log('input:\n' + show(B), '\n');
    if (r) {
        // console.log('solution:\n' + show(X));
    } else {
        console.error('matrix is singular')
    }
    return X;
};

var crout = function (A, L, U) {
    // var m = A.shape[0];
    var m = A.length;

    // var n = A.shape[1];
    var n = A[0].length;
    if (m !== n) return false; // non-square
    if (L && !U) U = L;
    
    // diagonalize U
    for (var i = 0; i < n; i++) {
        // U.set(i, i, 1);
        U[i][i]=1;
    }
    
    for (var j = 0; j < n; j++) {
        for (var i = j; i < n; i++) {
            var sum = 0;
            for (var k = 0; k < j; k++) {
                // sum += L.get(k,i) * U.get(j,k);  
                sum+= L[k][i]*U[j][k];
            }
            // L.set(j, i, A.get(j,i) - sum);
            L[j][i] = A[j][i]-sum;
        }

        // var denom = L.get(j,j);
        let denom  = L[j][j];
        if (denom === 0) return false;

        for (var i = j+1; i < n; i++){
            var sum = 0;
            for (var k = 0; k < j; k++){
                // sum += L.get(k,j) * U.get(i, k);
                sum+= L[k][j]*U[i][k];
            }
            // U.set(i, j, (A.get(i,j) - sum) / denom);
            U[i][j] =(A[i][j]-sum)/denom;
        }
    }
    return true;
};


function denseGeneralSolve(m, X, A, B) {
    // var L = scratch.malloc([ m, m ]);
    let L = zeros(m,m)

    var ok = crout(A, L, L);
    if (!ok) {
        // scratch.free(L);
        console.error("solve failed");
        return false;
    }
    var Y = zeros(m,1);// scratch.malloc([ m ]);
    var res = solve(L, L, B, X, Y);
    // scratch.free(Y)
    // scratch.free(L);
    return !!res;
}

var solve = function (L, U, B, X, Y) {
    // var m = L.shape[0], n = L.shape[1], freeY = false;
    var m = L.length, n = L[0].length;//freeY = false;
    
    if (U.dimension === 1) {
        Y = X;
        X = B;
        B = U;
        U = L;
    }
    // if (!X) X = ndscratch.malloc([m]);
    if (!X) X = zeros(m,1);
    if (!Y) {

        // Y = ndscratch.malloc([m]);
        // freeY = true
        Y = zeros(m,1);
    }
    
    // LY = B, solve for Y
    for (var y = 0; y < n; y++) {
        var c = 0;
        for (var x = 0; x < y; x++) {
            c += L[x][y] * Y[x];
            // c += L.get(x, y) * Y.get(x);
        }
        Y[y] = (B[y] - c) / L[y][y];
        // Y.set(y, (B.get(y) - c) / L.get(y, y));
    }
    
    //UX = Y, solve for X
    for (var y = n - 1; y >= 0; y--) {
        var c = 0;
        for (var x = n - 1; x > y; x--) {
            c += U[x][y] * X[x];
            // c += U.get(x, y) * X.get(x);
        }
        X[y] = Y[y] - c;
        // X.set(y, Y.get(y) - c);
    }
    
    // if (freeY) ndscratch.free(Y);
    
    return X;
};
