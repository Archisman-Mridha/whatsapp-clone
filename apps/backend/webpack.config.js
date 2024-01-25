const { composePlugins, withNx } = require("@nx/webpack")

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: "node",

    // Using the SWC compiler causes errors like - healthCheckService / configService is undefined.
    // compiler: "swc"
  }),
  config => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin( ))`
    return config
  }
)
