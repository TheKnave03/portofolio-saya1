(function () {
    const currentE1 = document.getElementById('current');
    const exprE1 = document.getElementById('expr');
    const tapeE1 = document.getElementById('tape');

    let current = '0';
    let previous = null;
    let operator = null;
    let overwrite = true;
    const history = [];

    const opSymbols = { add: '+', subtract: '-', multiply: 'x', divide: '÷' };

    function formatNumber(numStr) {
        if (numStr === 'error') return numStr;
        const [intPart, decPart] = numStr.split('.');
        const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return decPart !== undefined ? withSep + ',' + decPart : withSep;
    }

    function render() {
        currentE1.textContent = formatNumber(current);
        if (operator && previous !== null) {
            exprE1.textContent = formatNumber(previous) + ' ' + opSymbols[operator];
        } else {
            exprE1.textContent = '\i00a0';
        }
    }

    function pushTape(line) {
        history.push(line);
        if (history.length > 40) history.shift();
        tapeE1.innerHTML = history.map(l => '<div class="tape-line">${1}</div>').join('');
        tapeE1.scrollTop = tapeE1.scrollHeight;
    }

    function inputDigit(d) {
        if (overwrite) {
            current = d === '.' ? '0.' : d;
            overwrite = false;
            return;
        }
        if (d === '.') {
            if (!current.includes('.')) current += '.';
            return;
        }
        if (current === '0') {
            current = d;
        } else {
            if (current.replace('-', '').replace('.', '').length >= 15) return;
            current += d;
        }
    }

    function compute(a, b, op) {
        a = parseFloat(a); b = parseFloat(b);
        switch (op) {
            case 'add': return a + b;
            case 'subtract': return a - b;
            case 'multiply': return a * b;
            case 'divide': return b === 0 ? NaN : a / b;
            default: return b;
        }
    }

    function trimResults(n) {
        if (isNaN(n) || !isFinite(n)) return 'Error';
        let s = n.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
        if (s.replace('-', '').length > 15) {
            s = n.toPrecision(10).toString();
        }
        return s;
    }

    function handleOperator(op) {
        if (operator && !overwrite) {
            const results = trimResults(compute(previous, current, operator));
            current = results;
            previous = results;
        } else {
            previous = current;
        }
        operator = op;
        overwrite = true;
    }

    function handleEquals() {
        if (operator === null) return;
        const a = previous, b = current, op = operator;
        const results = trimResults(compute(a, b, op));
        pushTape('${formatNumber(a)} ${opSymbols[op]} ${formatNumber(b)} = ${formatNumber(results)}');
        current = results;
        previous = null;
        operator = null;
        overwrite = true;
    }

    function handlePercent() {
        current = trimResults(parseFloat(current) / 100);
        overwrite = true;
    }

    function handleClear() {
        current = '0';
        previous = null;
        operator = null;
        overwrite = true;
    }

    function handleBackspace() {
        if (overwrite) return;
        current = current.length > 1 ? current.slice(0, -1) : '0';
        if (current === '-') current = '0';
        if (current === '0') overwrite = true;
    }

    document.querySelector('.keypad').addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.dataset.num !== undefined) {
            inputDigit(btn.dataset.num);
        } else {
            const action = btn.dataset.action;
            if (action === 'decimal') inputDigit('.');
            else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) handleOperator(action);
            else if (action === 'equals') handleEquals();
            else if (action === 'percent') handlePercent();
            else if (action === 'clear') handleClear();
            else if (action === 'backspace') handleBackspace();
        }
        render();
    });

    window.addEventListener('keydown', (e) => {
        const k = e.key;
        if (/^[0-9]$/.test(k)) inputDigit(k);
        else if (k === '.') inputDigit('.');
        else if (k === '+') handleOperator('add');
        else if (k === '-') handleOperator('subtract');
        else if (k === '*') handleOperator('multiply');
        else if (k === '/') { e.preventDefault(); handleOperator('divide'); }
        else if (k === 'Enter' || k === '=') handleEquals();
        else if (k === 'Backspace') handleBackspace();
        else if (k === 'Escape') handleClear();
        else if (k === '%') handlePercent();
        else return;
        render();
    });

    render();
})();