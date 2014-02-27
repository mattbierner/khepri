({
    baseUrl: ".",
    normalizeDirDefines: "all",
    
    paths: {
        'khepri': 'dist',
        
        'khepri-parse': 'dependencies/khepri-parse/dist',
        
        'bennu': 'dependencies/bennu/dist',
        'nu-stream': 'dependencies/nu/dist',
        'seshet': 'dependencies/seshet/dist/seshet',
        'bes': 'dependencies/bes/dist',
        
        'hashtrie': 'dependencies/hashtrie/dist/hashtrie',
        
        'ecma-unparse': '../ecma-unparse/dist',
        'ecma-ast': '../ecma-ast/dist',
        'khepri-ast': 'dependencies/khepri-ast/dist',
        
        'neith': 'dependencies/neith/dist',
        'ecma-ast-zipper': 'dependencies/ecma-ast-zipper/dist/ecma_zipper',
        'khepri-ast-zipper': 'dependencies/khepri-ast-zipper/dist/khepri_zipper'
    },
    name: "javascripts/console.js",
    out: "javascripts/console-built.js"
})