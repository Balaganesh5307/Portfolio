import sys
from PIL import Image

def remove_black_background(input_path, output_path, threshold=20):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    for item in data:
        # Check if the pixel is dark (r, g, b all below threshold)
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            # Calculate alpha based on how close to black it is to create a smooth edge
            # If it's completely black (0,0,0), alpha is 0
            # If it's at threshold, alpha is 255 (or somewhat transparent)
            avg = sum(item[:3]) / 3
            alpha = int((avg / threshold) * 255)
            # Make it fully transparent if it's really black
            if avg < 5:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append((item[0], item[1], item[2], alpha))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path)
    print(f"Saved {output_path}")

input_img = r"C:\Users\bg695\.gemini\antigravity-ide\brain\71fcfe06-3b2f-4a2a-877d-aacf4e40b855\.user_uploaded\media_1787044099796.png"
output_img = r"c:\Users\bg695\Desktop\Testsample\Portfolio\frontend\public\logo.png"

remove_black_background(input_img, output_img, threshold=40)
