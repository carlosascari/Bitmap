/**
* Provides Bitmap class.
*
* Usage @example
* 	
*	var bitmap = new Bitmap()
* 	bitmap.putImageData(<ImageData>)
*
* 	var img = document.createElement('img')
* 	img.src = bitmap.toString()
* 	document.body.appendChild(img)
*
* @module Bitmap
*/
var Bitmap = (function() {

/**
* @private
* @final
* @property DATA_URI_SIGNATURE
* @type String
*/
const DATA_URI_SIGNATURE = 'data:image/bmp;base64,'

/**
* For debugging the structure and bitmapdata properties
*
* @private
* @method hexdump
* @param data {Array}
* @return String
*/
function hexdump(data)
{
	var dump = ''
	var line = 0
	for (var i = 0, l = data.length; i < l; i++)
	{
		if (line >= 16)
		{
			line = 0
			dump += '\n'
		}

		var hex = data[i].toString(16).toUpperCase()

		if (hex.length === 1)
		{
			hex = '0' + hex
		}

		dump += hex + ' '
		line++
	}

	return dump
}

/**
* @method row_size
* @param imageWidth {Number}
* @param bitsPerPixel {Number}
* @return Number
*/
function row_size(imageWidth, bitsPerPixel)
{
	return ~~((bitsPerPixel * imageWidth + 31)  / 32) * 4
}

/**
* @private
* @method byte_to_character
* @param v {Number}
* @return String
*/
function byte_to_character(v)
{
	return String.fromCharCode(v & 0xFF)
}

/**
* @private
* @method byte
* @param v {Number}
* @return Array
*/
function byte(v)
{
	return [v & 0xFF]
}

/**
* @private
* @method word
* @param v {Number}
* @return Array
*/
function word(v)
{
	return [v & 0xFF, (v >> 8) & 0xFF]
}

/**
* @private
* @method dword
* @param v {Number}
* @return Array
*/
function dword(v)
{
	return [
		(v & 0x000000FF) & 0xFF, 
		(v >> 8) & 0xFF, 
		(v >> 16) & 0xFF, 
		(v >> 24) & 0xFF
	]
}

/**
* Converts a Little Endian multibyte array to its Numeric Value.
*
* @private
* @method to_integer
* @param nbyte {Array}
* @return Number
*/
function to_integer(nbyte)
{
	var v = 0
	for (var i = 0, l = nbyte.length; i < l; i++)
	{
		var byte = nbyte[i]
		v = v | (byte << (8 * i))
	}
	return v
}

/**
* Unused, MAY be deprecated.
* 
* @private
* @method toggle_endianess
* @param nbyte {Array}
*/
function toggle_endianess(nbyte)
{
	var size = nbyte.length
	for (var i = 0; i < size; i++)
	{
		var byte = nbyte.splice(i, 1)[0]
		nbyte.unshift(byte)
	}
	return nbyte
}

/**
* @private
* @method copy
* @param source {Array} of bytes
* @param destination {Array} of bytes
* @param [offset] {Number} destination offset
*/
function copy(source, destination, offset)
{
	offset = offset >>> 0
	var length = Math.min(source.length, destination.length)
	for (var i = 0; i < length; i++)
	{
		destination[offset + i] = source[i] & 0xFF
	}
}

/**
* @class Bitmap
* @constructor
*/
function Bitmap()
{
	var instance = this
	var structure = []
	var width = dword()
	var height = dword()
	var filesize = dword()
	var bitmapsize = dword()
	var bitmapdata = []
	// -------------------------------------------------------------------------

	// BMP Header 14 bytes
	structure.push.apply(structure, word(0x4D42))		// WORD  Bitmap Signature
	structure.push.apply(structure, filesize)			// DWORD Size of the BMP file in Bytes
	structure.push.apply(structure, dword())			// DWORD 
	structure.push.apply(structure, dword(0x36))		// DWORD Offset to start of Image Data

	// DIB Header (BITMAPINFOHEADER) 40
	structure.push.apply(structure, dword(0x28))		// DWORD DIB Header Size/Version
	structure.push.apply(structure, width)				// DWORD Width
	structure.push.apply(structure, height)				// DWORD Height
	structure.push.apply(structure, word(0x1))			// WORD  Planes (Must be one)
	structure.push.apply(structure, word(0x18))			// WORD  bbp Bits Per Pixel: 24
	structure.push.apply(structure, dword())			// DWORD Compression: None
	structure.push.apply(structure, bitmapsize)			// DWORD Size of Bitmap Image Data w/padding in Bytes
	structure.push.apply(structure, dword(0x00000B13))	// DWORD pixels per meter horizontal
	structure.push.apply(structure, dword(0x00000B13))	// DWORD pixels per meter vertical
	structure.push.apply(structure, dword())			// DWORD Number of colors
	structure.push.apply(structure, dword())			// DWORD Important colors

	// -------------------------------------------------------------------------

	/**
	* Sets filesize DWORD in the bitmap header.
	*
	* @property filesize
	* @type Number
	*/
	Object.defineProperty(this, 'filesize', {
		configurable: false, enumerable: true,
		get: function Bitmap__get_filesize()
		{
			return to_integer(structure.slice(2, 2 + 4))
		},
		set: function Bitmap__set_filesize(v)
		{
			copy(dword(v), structure, 2)
		}
	})

	/**
	* Sets bitmapsize DWORD in the bitmap header.
	*
	* @property bitmapsize
	* @type Number
	*/
	Object.defineProperty(this, 'bitmapsize', {
		configurable: false, enumerable: true,
		get: function Bitmap__get_bitmapsize()
		{
			return to_integer(structure.slice(34, 34 + 4))
		},
		set: function Bitmap__set_bitmapsize(v)
		{
			copy(dword(v), structure, 34)
		}
	})

	/**
	* Sets width DWORD in the bitmap header.
	*
	* @property width
	* @type Number
	*/
	Object.defineProperty(instance, 'width', {
		configurable: false, enumerable: true,
		get: function Bitmap__get_width()
		{
			return to_integer(structure.slice(18, 18 + 4))
		},
		set: function Bitmap__set_width(v)
		{
			copy(dword(v), structure, 18)
		}
	})

	/**
	* Sets height DWORD in the bitmap header.
	*
	* @property height
	* @type Number
	*/
	Object.defineProperty(instance, 'height', {
		configurable: false, enumerable: true,
		get: function Bitmap__get_height()
		{
			return to_integer(structure.slice(22, 22 + 4))
		},
		set: function Bitmap__set_height(v)
		{
			copy(dword(v), structure, 22)
		}
	})

	// -------------------------------------------------------------------------

	/**
	* @method putImageData
	* @param imageData {ImageData}
	*/
	Object.defineProperty(instance, 'putImageData', {
		configurable: false, enumerable: true,
		value: function Bitmap__putImageData(imageData)
		{
			var image_width = imageData.width
			var image_height = imageData.height
			var pixelview = new Uint32Array(imageData.data.buffer)
			var rows = []

			for (var y = 0; y < image_height; y++)
			{
				rows[y] = []
				for (var x = 0; x < image_width; x++)
				{
					var pixelABGR = pixelview[image_width * y + x]
					var pixelBGR = [
						(pixelABGR >> 16) & 0xFF,
						(pixelABGR >> 8) & 0xFF,
						(pixelABGR) & 0xFF,
					]
					rows[y][x] = pixelBGR
				}
			}

			bitmapdata.length = 0
			var alignment_bytes = []
			var bitsPerPixel = to_integer(structure.slice(28, 28 + 4))
			var rowSize = row_size(image_width, bitsPerPixel)
			var alignmentByteCount = rowSize - (image_width * 3) 

			for (var i = 0; i < alignmentByteCount; i++)
			{
				alignment_bytes[i] = 0
			}

			for (var y = image_height - 1; y >= 0; y--)
			{
				var row = rows[y]

				for (var x = 0, l = row.length; x < l; x++)
				{
					var pixelBGR = row[x]
					bitmapdata.push(
						pixelBGR[0] & 0xFF,
						pixelBGR[1] & 0xFF,
						pixelBGR[2] & 0xFF
					)
				}

				bitmapdata.push.apply(bitmapdata, alignment_bytes)
			}

			instance.width = image_width
			instance.height = image_height
		}
	})

	/**
	* @method toString
	*/
	Object.defineProperty(instance, 'toString', {
		configurable: true, enumerable: true,
		value: function Bitmap__toString()
		{
			var struct = structure.slice(0)
			struct.push.apply(struct, bitmapdata)
			instance.filesize = struct.length
			instance.bitmapsize = bitmapdata.length
			var raw = struct.map(byte_to_character).join('')
			return DATA_URI_SIGNATURE + btoa(raw)
		}
	})
}

return Bitmap
})();
