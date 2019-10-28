const webpack = require("webpack");
const config = require("./webpack.config");

webpack(config).run((err, stat) => {
  console.log(err);
  console.log(stat.toString("normal"));
});
