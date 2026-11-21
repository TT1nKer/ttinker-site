(() => {
  function mount() {
    const desk = document.querySelector('[data-trace]');
    if (!desk || desk.dataset.ready) return;
    desk.dataset.ready = 'true';
    const buttons = [...desk.querySelectorAll('[data-trace-key]')];
    const groups = [...desk.querySelectorAll('[data-asm-group]')];
    const wires = desk.querySelector('.wires');
    const lines = [...wires.children];
    const expression = desk.querySelector('[data-expression]');
    const mnemonic = desk.querySelector('[data-mnemonic]');
    let selected = buttons.find(button => button.getAttribute('aria-pressed') === 'true');

    function connect() {
      const target = desk.querySelector('.is-active .primary-op');
      if (!selected || !target || !wires.clientWidth) return;
      const bounds = wires.getBoundingClientRect();
      const source = selected.getBoundingClientRect();
      const instruction = target.getBoundingClientRect();
      const start = source.top - bounds.top + source.height / 2;
      const end = instruction.top - bounds.top + instruction.height / 2;
      for (let i = 0; i < lines.length; i++) {
        const offset = i - (lines.length - 1) / 2;
        const y = start + offset * 3.3;
        const dy = end + offset * 1.8 - y;
        const line = lines[i];
        line.style.top = y + 'px';
        line.style.width = Math.hypot(bounds.width, dy) + 'px';
        line.style.transform = 'rotate(' + Math.atan2(dy, bounds.width) + 'rad)';
        line.style.visibility = 'visible';
      }
    }

    function select(button) {
      selected = button;
      for (const item of buttons) item.setAttribute('aria-pressed', String(item === button));
      for (const group of groups) {
        const active = group.dataset.asmGroup === button.dataset.traceKey;
        group.hidden = !active;
        group.classList.toggle('is-active', active);
      }
      expression.textContent = button.dataset.expressionValue;
      mnemonic.textContent = button.dataset.mnemonicValue;
      connect();
    }

    desk.querySelector('.trace-help').hidden = false;
    buttons.forEach((button, i) => {
      button.disabled = false;
      button.addEventListener('click', () => select(button));
      button.addEventListener('keydown', event => {
        if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
        event.preventDefault();
        let index = (i + (event.key === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length;
        if (event.key === 'Home') index = 0;
        if (event.key === 'End') index = buttons.length - 1;
        buttons[index].focus();
        select(buttons[index]);
      });
    });
    if ('ResizeObserver' in window) new ResizeObserver(connect).observe(desk);
    else window.addEventListener('resize', connect);
    document.fonts?.ready.then(connect);
    connect();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once:true });
  else mount();
})();
