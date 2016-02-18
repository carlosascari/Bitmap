var image_element_to_image_data = (function(){
	var CANVAS = document.createElement('canvas')
	var CONTEXT = CANVAS.getContext('2d')
	function image_element_to_image_data (image_element) 
	{
		var width = image_element.width
		var height = image_element.height
		CANVAS.width = width
		CANVAS.height = height
		CONTEXT.drawImage(image_element, 0, 0)
		return CONTEXT.getImageData(0, 0, width, height)
	}
	return image_element_to_image_data
})();

var sample2x2 = image_element_to_image_data(document.getElementById('sample2x2'))
var sample3x3 = image_element_to_image_data(document.getElementById('sample3x3'))
var sample4x4 = image_element_to_image_data(document.getElementById('sample4x4'))
var sample10x10 = image_element_to_image_data(document.getElementById('sample10x10'))
var bitmap2x2 = new Bitmap()
var bitmap3x3 = new Bitmap()
var bitmap4x4 = new Bitmap()
var bitmap10x10 = new Bitmap()
bitmap2x2.putImageData(sample2x2)
bitmap3x3.putImageData(sample3x3)
bitmap4x4.putImageData(sample4x4)
bitmap10x10.putImageData(sample10x10)
var img2x2 = document.createElement('img')
img2x2.src = bitmap2x2.toString()
document.body.appendChild(img2x2)
var img3x3 = document.createElement('img')
img3x3.src = bitmap3x3.toString()
document.body.appendChild(img3x3)
var img4x4 = document.createElement('img')
img4x4.src = bitmap4x4.toString()
document.body.appendChild(img4x4)
var img10x10 = document.createElement('img')
img10x10.src = bitmap10x10 + ''
document.body.appendChild(img10x10)
