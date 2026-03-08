const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE_ICON = path.join(__dirname, '../public/icons/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

const icons = [
    { name: 'apple-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-maskable-192.png', size: 192, maskable: true },
    { name: 'icon-maskable-512.png', size: 512, maskable: true },
];

async function generateIcons() {
    console.log('🚀 Iniciando generación de iconos PWA...');

    if (!fs.existsSync(SOURCE_ICON)) {
        console.error(`❌ Error: No se encontró el logo fuente en ${SOURCE_ICON}`);
        process.exit(1);
    }

    for (const icon of icons) {
        const outputPath = path.join(OUTPUT_DIR, icon.name);

        try {
            if (icon.maskable) {
                // Para iconos maskable, dejamos un margen de seguridad (el logo ocupa el 80% del área)
                const logoSize = Math.floor(icon.size * 0.8);
                const padding = Math.floor((icon.size - logoSize) / 2);

                await sharp(SOURCE_ICON)
                    .resize(logoSize, logoSize, {
                        fit: 'contain',
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    })
                    .extend({
                        top: padding,
                        bottom: padding,
                        left: padding,
                        right: padding,
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    })
                    .toFile(outputPath);
            } else {
                await sharp(SOURCE_ICON)
                    .resize(icon.size, icon.size, {
                        fit: 'contain',
                        background: { r: 0, g: 0, b: 0, alpha: 0 }
                    })
                    .toFile(outputPath);
            }
            console.log(`✅ Generado: ${icon.name} (${icon.size}x${icon.size})`);
        } catch (err) {
            console.error(`❌ Error generando ${icon.name}:`, err);
        }
    }

    console.log('✨ ¡Todos los iconos han sido actualizados con el logo oficial!');
}

generateIcons();
