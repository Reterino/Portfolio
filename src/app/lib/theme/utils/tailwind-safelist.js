const fs = require('fs');

const safelist = [];
const prefixes = ['', 'hover:', 'active:', 'focus:', 'dark:'];
const types    = ['bg', 'border', 'text', 'divide'];
const tints    = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const colors   = ['rag0', 'rag1', 'rag2', 'rag3'];

prefixes.forEach(prefix => {
	types.forEach(type => {
		colors.forEach(color => {
			tints.forEach(tint => {
				safelist.push(`${prefix + type}-${color}-${tint}`)
			})
		})
	})
})

fs.writeFileSync('src/app/lib/theme/tw/tailwind-safelist.txt',safelist.join('\n'));