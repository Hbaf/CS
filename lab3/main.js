// Реализуем первый ЛСР (89, 6, 5, 3, 0)
function* generateLSR1() {
	let lsr1 = [];
	for (let i = 0; i < 90; i++){
		lsr1.push(Math.round(Math.random()));
	}
	while (true) {
		// Сдвигаем наш ЛСР
		lsr1.unshift((lsr1[0] ^ lsr1[82] ^ lsr1[83] ^ lsr1[85] ^ lsr1.pop()));
		// Отправляем 20 бит в результат работы
		yield lsr1[69];

	}
}

// Реализуем второй ЛСР (91, 8, 5, 1, 0)
function* generateLSR2() {
	let lsr2 = [];
	for (let i = 0; i < 92; i++){
		lsr2.push(Math.round(Math.random()));
	}
	let generator =	generateLSR1();
	while (true) {
		if (generator.next().value) {
			lsr2.unshift(lsr2[0] ^ lsr2[82] ^ lsr2[85] ^ lsr2[89] ^ lsr2.pop());
		}
		// Отправляем 3 бита на вывод
		yield '' + lsr2[0] + lsr2[2] + lsr2[71];
	}
}

// Конечный выхлоп гамма-функции
function* generateGamma() {
	let gen = generateLSR2();
	while (true) {
		let val = gen.next().value;
		// Генерируем гамму
		yield (parseInt(val[0], 2) | parseInt(val[1], 2)) & parseInt(val[2], 2);
	}
}

const gen = generateGamma();

let text = '';
let shifrText = '';

const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
	// Выход по Ctrl + C
	if (key.sequence === '\u0003') {
		finish();
		process.exit();
	}
	// Считываем текст
	if (str >= 'a' & str <= 'z'){
		process.stdout.write( str );
		text += str
		let code = str.charCodeAt(0);
		let shifr = ''
		for (let i = 0; i < code.toString(2).length; i++) {
			shifr += gen.next().value;
		}
		shifr = parseInt(shifr, 2);
		// Шифруем текст
		shifrText += String.fromCharCode(code ^ shifr);
	}
})

function finish() {
	console.log();
	console.log(shifrText);
}