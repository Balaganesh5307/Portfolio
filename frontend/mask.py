from PIL import Image, ImageDraw
import os

def mask_image(path):
    img = Image.open(path).convert("RGBA")
    # Create a mask
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, img.size[0], img.size[1]), fill=255)
    
    # Apply the mask
    result = Image.new('RGBA', img.size, (0,0,0,0))
    result.paste(img, (0,0), mask)
    result.save(path)

files = [
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
    'public/apple-touch-icon.png'
]

for f in files:
    try:
        mask_image(f)
        print(f"Successfully masked {f}")
    except Exception as e:
        print(f"Error masking {f}: {e}")
