import path from 'path'
import fs from 'fs'

const getExampleEntries = () => {
  const dir = 'example'
  let entry = {
    'via': path.join(__dirname, '../src')
  }

  fs.readdirSync(`./${dir}`)
    .filter((name) => fs.statSync(`./${dir}/${name}`).isDirectory())
    .forEach((name) => {
      entry[name] = path.join(__dirname, `../${dir}`, name)
    })

  return entry
}

export default {
  entry: getExampleEntries(),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dev/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: '#eval-source-map'
}
