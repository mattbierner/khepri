({
    baseUrl: ".",
    normalizeDirDefines: "all",
    
    paths: {
        'khepri': 'dist',
        'bennu': 'dependencies/bennu/dist',
        'nu-stream': 'dependencies/nu/dist',
        'seshet': 'dependencies/seshet/dist/seshet',
        'bes': 'dependencies/bes/dist',

        'ecma-unparse': 'dependencies/ecma-unparse/lib',

        'ecma_ast': 'dependencies/ecma-ast/lib',
        'khepri_ast': 'dependencies/khepri-ast/dist',
        
        'neith': 'dependencies/neith/dist',
        'ecma_ast_zipper': 'dependencies/ecma-ast-zipper/dist',
        'khepri_ast_zipper': 'dependencies/khepri-ast-zipper/dist',
    },
    name: "javascripts/console.js",
    out: "javascripts/console-built.js"
})