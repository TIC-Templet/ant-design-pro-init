const env = process.env.ENV;
module.exports = (config, { webpack }) => {
    // add plugins
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.ENV': JSON.stringify(env),
        })
    );
    // do something else
    return config;
};
