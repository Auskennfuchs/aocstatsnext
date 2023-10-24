const webpack = require("webpack")

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",
    webpack: (config) => {
        const env = Object.keys(process.env)
            .filter((e) => !e.startsWith("NEXT_") && !e.startsWith("__NEXT_"))
            .reduce((acc, curr) => {
                acc[`process.env.${curr}`] = JSON.stringify(process.env[curr])
                return acc
            }, {})

        config.plugins.push(new webpack.DefinePlugin(env))

        return config
    },
}

module.exports = nextConfig
