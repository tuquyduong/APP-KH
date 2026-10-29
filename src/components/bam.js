/** Thuộc tính cho phần tử không phải <button> mà bấm được: role, Tab, Enter + Space, và không cho phím nổi bọt lên phần tử cha cũng bấm được. */
export const bam = (f) => ({
  role: 'button',
  tabIndex: 0,
  onClick: f,
  onKeyDown: (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); f(e); }
  },
});
