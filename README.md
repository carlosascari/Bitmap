# Bitmap

This is a converter, any image that is supported by your browser will be converted to a [24bit BITMAPINFOHEADER](https://en.wikipedia.org/wiki/BMP_file_format) Bitmap image. 

The issue here is that all images that the canvas [toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) method accepts, will save your image after altering the original pixels you set. I'll elaborate: 

If at the center of an image you set two pixels a fixed value, when you convert it to a Data Url, and set the `src` attribute of Image Element, the Image you have if you re-read it through the canvas, or download it and read it from some external program, those pixels will usually have different a value.

The 24bit Bitmap Image is a slim, simple and well documented format that will store the value of all your pixels without altering their original values.

### Usage

```

var bitmap = new Bitmap()

bitmap.putImageData(<ImageData>)

var img = document.createElement('img')

img.src = bitmap.toString()

```

### API

##### Properties

**NOTE** Calling **putImageData** will set these properties. 

*Number* **filesize**
The total size of the Bitmap file that will be created.

*Number* **bitmapsize**
The size of the pixel data, plus row alignments bytes, maybe (read the wiki).

*Number* **height**
The height of the image.

*Number* **width**
The width of the image.

##### Methods

**putImageData**(*ImageData*)
Reads an ImageData instance.

*String* **toString**()
Returns a Bitmap DataURL.
