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
rect_visualize()

function rect_visualize(){
    window.requestAnimationFrame(rect_visualize)
    let freq = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(freq)
	
    ctx.clearRect(0, 0, width, height)
    
    freq.forEach((f, i) => draw(f,i,height,'#ffbb03'))

    ctx.lineWidth = 1
    ctx.beginPath()
}

function draw(freq, index, height, color){
    ctx.fillStyle = color
    ctx.fillRect(index, (height - freq) / 2, 1, freq)
}

function upload(){
    let input = document.querySelector('input[type="file"]')
    input.click()
}

function file_uploaded(input){
    let url = URL.createObjectURL(input.files[0])
    audio.src = url
    audio.play().then(() => rect_visualize() )
}