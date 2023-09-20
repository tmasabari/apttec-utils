// https://stackoverflow.com/questions/46413935/eslint-doesnt-recognize-node-jss-global-object
module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
        //'jquery': true,
        mocha: true,        //required for test cases

        //required for gloabl
        node: true
    },
    //exclude built files, third party libraries and config files
    'ignorePatterns': ['dist/**', 'docs/**', 'out/**', 'Scripts/UTIF.js', 'webpack.config.js'],
    'plugins': ['compat'],
    'extends': ['plugin:compat/recommended', 'eslint:recommended'],
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'json-comments': 0,
        'indent': [
            'error',
            4
        ],
        // 'linebreak-style': [
        //     'error',
        //     'unix'
        // ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
