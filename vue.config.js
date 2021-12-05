module.exports = {
    publicPath : '',
    devServer: {
        proxy: {
            "/meishe-wxapi": {
                target: "http://api.meisheapp.com",
                headers: {
                    'origin': 'http://m.meisheapp.com'
                },
                // changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/meishe-wxapi": ''
                }
            }
        },
    }
}
