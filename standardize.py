import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Layout changes
    # Sidebar width: 280px, Collapsed: 72px (handled in CSS but we can replace in class names to be pure)
    content = re.sub(r'\bw-72\b', 'w-[280px]', content)
    content = re.sub(r'\bw-20\b', 'w-[72px]', content)
    content = re.sub(r'\bml-72\b', 'ml-[280px]', content)
    content = re.sub(r'\bml-20\b', 'ml-[72px]', content)
    content = re.sub(r'\bh-16\b', 'h-[64px]', content)

    # ICONS: 18x18
    content = re.sub(r'\bw-4\s+h-4\b', 'w-[18px] h-[18px]', content)
    content = re.sub(r'\bw-5\s+h-5\b', 'w-[18px] h-[18px]', content)
    content = re.sub(r'\bw-6\s+h-6\b', 'w-[18px] h-[18px]', content)
    content = re.sub(r'\bw-3\.5\s+h-3\.5\b', 'w-[18px] h-[18px]', content)
    
    # CARD PADDING (heuristic: bg-white p-4 -> bg-white p-[20px])
    content = re.sub(r'(bg-white\s+[^"\'`]*?)\bp-4\b', r'\1p-[20px]', content)
    content = re.sub(r'(bg-white\s+[^"\'`]*?)\bp-6\b', r'\1p-[20px]', content)
    
    # MAIN CONTENT PADDING
    # usually inside a <main> or similar containing p-4 or p-6.
    content = re.sub(r'(<main[^>]*?className=["\'][^"\']*?)\bp-4\b', r'\1p-[24px]', content)
    content = re.sub(r'(<main[^>]*?className=["\'][^"\']*?)\bp-6\b', r'\1p-[24px]', content)
    content = re.sub(r'(<div[^>]*?flex-1[^>]*?)\bp-4\b', r'\1p-[24px]', content)
    content = re.sub(r'(<div[^>]*?flex-1[^>]*?)\bp-6\b', r'\1p-[24px]', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    src_dir = r"c:\Users\lr690\OneDrive\GST 2.0\src"
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
