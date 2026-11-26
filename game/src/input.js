export const input = {
  down: new Set(),
  pressed: new Set(),
  init() {
    const prevent = e => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', e => {
      prevent(e);
      if (!this.down.has(e.code)) {
        this.down.add(e.code);
      }
      if (!this.pressed.has(e.code)) {
        this.pressed.add(e.code);
      }
    });
    window.addEventListener('keyup', e => {
      this.down.delete(e.code);
    });
  },
  isDown(code) {
    return this.down.has(code);
  },
  wasPressed(code) {
    return this.pressed.has(code);
  },
  endFrame() {
    this.pressed.clear();
  }
};
