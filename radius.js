let canvas = document.getElementsByTagName('canvas')[0]
let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight
let ctx = canvas.getContext('2d')

let context = new AudioContext()
let analyser = context.createAnalyser()

let audio = new Audio()
audio.loop = false
audio.crossOrigin = 'anonymous'

let source = context.createMediaElementSource(audio)
source.connect(analyser)
analyser.connect(context.destination)
analyser.fftSize = 4096

let totalTime = Math.ceil(audio.duration)

let bufferLength = analyser.frequencyBinCount
let frequencyData = new Uint8Array(bufferLength)
function Render() {
    ctx.clearRect(0, 0, width, height)
    analyser.getByteFrequencyData(frequencyData)
    let circleRadius = height/5;
    let frequencyWidth = ((2*Math.PI) / bufferLength), frequencyHeight = 0, x = 0
    for(let increment = 0; increment < bufferLength; increment+=5) {
        frequencyHeight = frequencyData[increment] * (height * 0.0010)
        ctx.fillRect(x, height - frequencyHeight, frequencyWidth, frequencyHeight)
        ctx.beginPath()
        let ax  = width/2 +(circleRadius* Math.cos(x*1000))
        let ay  = height/2 +(circleRadius* Math.sin(x*1000))
        let bx  = width/2 +((circleRadius+frequencyHeight)* Math.cos(x*1000))
        let by =  height/2 +((circleRadius+frequencyHeight)* Math.sin(x*1000))
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.lineWidth = 2
        ctx.strokeStyle = "#ffbb03"
        ctx.stroke()

        let currentTime = Math.ceil(audio.currentTime)
        ctx.beginPath()
        ctx.arc(width/2, height/2, circleRadius-10, -0.5*Math.PI, -0.5*Math.PI+(((2*Math.PI)/totalTime)*currentTime), false)
        ctx.lineWidth = 1
        ctx.stroke()
        x += (2*Math.PI)/(bufferLength)
    }
    window.requestAnimationFrame(Render)
}

function upload(){
    let input = document.querySelector('input[type="file"]')
    input.click()
}

function file_uploaded(input){
    let url = URL.createObjectURL(input.files[0])
    audio.src = url
    audio.play().then(() => Render() )
}