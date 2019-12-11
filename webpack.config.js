const path = require("path");

module.exports = {
	entry: "./src/VideoResize.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "video-resize.min.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.join(__dirname, "src"),
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"]
						}
					}
				]
			},
			{
				test: /\.svg$/,
				use: [{loader: "raw-loader"}]
			}
		]
	}
};
