const path =  require ('path');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

    //Declaracion del módulo de exportación
    module.exports = {

        //Declaracion del archivo de origen de nuestro proyecto el cual va a tomar como báse
        entry: './src/index.js',

        //Declaracion del archivo de salida en este caso se utiliza la carpeta dist que es la que se usa comunmente
        // "filename:" se declara el mombre del archivo en donde se genera la informacion resultante
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            assetModuleFilename: 'assets/images/[hash][ext][query]'
        },
        resolve:{
            extensions: ['.js'],
            alias:{
                '@utils': path.resolve( __dirname, "src/utils/"),
                '@templates': path.resolve( __dirname, "src/templates/"),
                '@styles': path.resolve( __dirname, "src/styles/"),
                '@images': path.resolve( __dirname, "src/assets/images/"),
            }
        },

        module: {
            rules: [
                {
                    //Expresion regular que busca los archivos con extencion js ó mjs
                    test: /\.m?js$/,
                    //Expresion que indica que excluya todos los modulos de node
                    exclude: /node-modules/,
                    //indica el loader que se va a utilizar
                    use:{
                        loader: "babel-loader"
                    }
                },
                {
                    //Se crea las reglas de que archivos se van a leer
                    test: /\.css|.styl$/i,
                    use:[
                        MiniCssExtractPlugin.loader, 
                            'css-loader',
                            'stylus-loader'
                    ]
                },
                {
                    test: /\.png/,
                    type:'asset/resource'
                },
                {
                    test: /\.(woff|woff2)$/, //Tipo de formato de fuente a leer
                    use: {
                        loader:'url-loader',
                        options:{
                            limit: 10000 , //Tamaño
                            mimetype: "application/font-woff", // tipo de formato
                            name: "[name].[contenthash].[ext]", //Nombre y extencion del archivo
                            outputPath: "./assets/fonts/", //carpeta de salida
                            publicPath: "../assets/fonts/", //carpeta publica
                            esModule: false, //se coloca false por que no se va a tilizar
                        },
                    }

                }
            ]
        },

        plugins:[
            new HtmlWebpackPlugin({
                //Isercion de los elementos
                inject: true,
                //Carga el templete
                template: './public/index.html',
                //Resultado de la preparacion de html
                filename: './index.html'
            }),
            //Agregamos el plugin de css
            new MiniCssExtractPlugin({
                filename: 'assets/[name].[contenthash].css'
            }),
            new CopyPlugin({
                patterns:[
                    {
                        from: path.resolve( __dirname , 'src' , 'assets/images'),
                        to: 'assets/images'
                    }
                ]
            }),
            new Dotenv(),
            new CleanWebpackPlugin(),
        ],
        optimization: {
            minimize : true,
            minimizer:[
                new CssMinimizerPlugin(),
                new TerserPlugin(),
            ]

        }
    }