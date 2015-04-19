({
    baseUrl: ".",
    normalizeDirDefines: "all",
    
    paths: {
        'khepri': 'dist',
        
        'khepri-parse': 'dependencies/khepri-parse/dist',
        'khepri-compile': 'dependencies/khepri-compile/dist',

        'bennu': 'dependencies/bennu/dist',
        'nu-stream': 'dependencies/nu/dist',
        'seshet': 'dependencies/seshet/dist/seshet',
        'bes': 'dependencies/bes/dist',
        
        'akh': 'dependencies/akh/dist',
        'zipper-m': 'dependencies/zipper-m/dist',

        'hamt': 'dependencies/hamt/dist/hamt',
        
        'ecma-unparse': 'dependencies/ecma-unparse/dist',
        'ecma-ast': 'dependencies/ecma-ast/dist',
        'khepri-ast': 'dependencies/khepri-ast/dist',
        
        'neith': 'dependencies/neith/dist',
        'ecma-ast-zipper': 'dependencies/ecma-ast-zipper/dist/ecma_zipper',
        'khepri-ast-zipper': 'dependencies/khepri-ast-zipper/dist/khepri_zipper',
        
        'xregexp': 'dependencies/xregexp/xregexp-all'
    },
    name: "javascripts/console.js",
    out: "javascripts/console-built.js"
})