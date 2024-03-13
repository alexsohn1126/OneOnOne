# 1 on 1

## How to Setup Tailwind CSS

1. Go to https://github.com/tailwindlabs/tailwindcss/releases 
2. Download the latest tailwindcss standalone executable version for your machine (v3.4.1 used at the time of writing)
3. Move the executable into the project's root (where this readme is located)
4. Open your terminal (Powershell if on windows) and cd into the project root
5. Enter `[tailwindcss executable path] -i styles\input.css -o styles\output.css --watch`
    - It was `.\tailwindcss-windows-x64.exe -i styles\input.css -o styles\output.css --watch` for Windows
    - But for mac the executable name will be different

That's it!

Make sure to include the `styles\output.css` as the stylesheet in html files, not `styles\input.css`.

Also, currently only the HTML files within specified folders will be able to use Tailwind CSS. To change, check `tailwind.config.js`.
