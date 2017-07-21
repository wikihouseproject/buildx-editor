const fs = require('fs')
const Canvas = require('canvas')
const Image = Canvas.Image

const drawPiece = (id, [width, height], points, dirName = 'temp', cb) => {
  const canvas = new Canvas(width, height)
  const ctx = canvas.getContext('2d')

  ctx.beginPath()

  const normalizedPoints = points.map( ([x,y]) => [200+x/1,200+y/1])

  ctx.moveTo(...normalizedPoints[0])
  normalizedPoints.slice(1).map( ([x,y]) => ctx.lineTo(x,y) )
  ctx.lineTo(...normalizedPoints[0])
  ctx.fillStyle = 'black'
  ctx.fill()

  if (!fs.existsSync(dirName)) fs.mkdirSync(`./${dirName}`)

  const out = fs.createWriteStream(__dirname + `/${dirName}` + `/${id}.png`)
  const stream = canvas.pngStream()

  stream.on('data', function(chunk){
    out.write(chunk);
  })

  stream.on('end', function(){
    cb('saved png');
  })
}

const allPoints = [
  [[250,-14.216835],[324.5381087442686,15.59840840687235],[314.73339488852025,40.1101930462432],[250,14.216835],[74.53810874426861,84.40159159312766],[64.73339488852028,59.88980695375681]],
  [[513.2,91.063165],[513.2,175],[486.8,175],[486.8,108.936835],[314.73339488852025,40.1101930462432],[324.5381087442686,15.59840840687235]],
  [[513.2,313.2],[425,313.2],[425,286.8],[486.8,286.8],[486.8,175],[513.2,175]],
  [[-13.2,313.2],[-13.200000000000001,225],[13.200000000000001,225],[13.2,286.8],[425,286.8],[425,313.2]],
  [[-13.2,91.063165],[64.73339488852028,59.88980695375681],[74.53810874426861,84.40159159312766],[13.2,108.936835],[13.200000000000001,225],[-13.200000000000001,225]],
  [[250,-14.216835],[324.5381087442686,15.59840840687235],[314.73339488852025,40.1101930462432],[250,14.216835],[74.53810874426861,84.40159159312766],[64.73339488852028,59.88980695375681]]
]
allPoints.forEach( (p, i) => {
  drawPiece(i, [500,500], p, 'temp', console.log)
})