from PIL import Image
import sys, os

path = os.path.abspath("") + "/";
processed = False
name = ''

def processImage(path, name):
	img = Image.open(os.path.join(path, name))
	size = img.size[0] / 4 # splits the width of the image by 3, expecting the 3x2 layout blender produces.
	folder = name.split('.')[0]
	splitAndSave(img, size, 0, size, "top.png", folder)
	splitAndSave(img, 0, size, size, "back.png",folder)
	splitAndSave(img, size, size, size, "left.png", folder)
	splitAndSave(img, size * 2, size, size, "front.png", folder)
	splitAndSave(img, size * 3, size, size, "right.png", folder)
	splitAndSave(img, size, size * 2, size, "bot.png", folder)

def addToFilename(name, add):
	name = name.split('.')
	return name[0] + add + "." + name[1]

def splitAndSave(img, startX, startY, size, name, folder):
	if not os.path.exists(folder):
		os.mkdir(folder)
	area = (startX, startY, startX + size, startY + size)
	i = img.crop(area)
	if name == "bot.png":
		i = i.rotate(90)
	if name == "top.png":
		i = i.rotate(270)
	saveImage(i, os.path.join(path, folder), name)

def saveImage(img, path, name):
	try:
		img.save(os.path.join(path, name))
	except:
		print "*   ERROR: Could not convert image."
		pass

for arg in sys.argv:
	if ".png" in arg or ".jpg" in arg:
		processImage(path, arg)
		processed = True
if not processed:
	print "*  ERROR: No Image"
	print "   usage: 'python script.py image-name.png'"