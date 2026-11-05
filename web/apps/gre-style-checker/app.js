/* Writing Style Checker: sentence length, passive voice, repeated words and linking words in any text. */
(function () {
  'use strict';
  // Mark up a text: passive phrases and very long sentences highlighted, as plain nodes.
  const longSentences = (text, limit) => SK.text.sentences(text).filter((s) => SK.text.wordCount(s) > (limit || 35));
  const App = {
    about: 'Paste any essay, email or paragraph to see the patterns a reader notices: how long your sentences are and how much they vary, passive phrases, words you repeat, very long sentences and the linking words you use. It counts honestly and explains what to look at; it does not grade.',
    how: ['Paste your text into **Check** and press **Check my writing**.', 'Look at the longest sentences first: can any be split?', 'Replace passive phrases where the doer matters.', 'Swap a repeated word for a precise synonym only when it reads better.'],
    tabs: [
      { id: 'check', label: 'Check', render(el) {
        const area = SK.h('textarea', { placeholder: 'Paste your writing here.', 'aria-label': 'Your writing' });
        area.value = SK.store.get('gre-style-checker.text', '');
        const out = SK.h('div', {});
        const run = () => {
          SK.store.set('gre-style-checker.text', area.value);
          SK.clear(out);
          if (SK.text.wordCount(area.value) < 20) { out.appendChild(SK.note('Paste at least a few sentences.', 'wrong')); return; }
          const a = SK.text.analyse(area.value);
          out.appendChild(SK.feedbackFor(a, { paragraphs: 2 }, false));
          const longs = longSentences(area.value);
          if (longs.length) out.appendChild(SK.card('Sentences over 35 words', SK.h('ol', {}, longs.map((s) => SK.h('li', { text: s })))));
          if (a.passive.length) out.appendChild(SK.card('Passive phrases', SK.h('p', {}, a.passive.map((p) => SK.h('span', { class: 'sk-pill', text: p })))));
          const lens = SK.text.sentences(area.value).map((s) => SK.text.wordCount(s));
          out.appendChild(SK.card('Sentence lengths in order', SK.chart.bars(lens.slice(0, 40).map((v, i) => ({ label: String(i + 1), value: v })), { label: 'Words per sentence' })));
        };
        el.appendChild(SK.card('Check your writing', area, SK.h('div', { style: { marginTop: '10px' } }, SK.btn('Check my writing', run, '', { 'data-auto': 'once' }))), out);
      } },
    ],
    longSentences,
    checks: {
      'long sentences and passives are found': (data, assert) => {
        const long = 'This sentence goes on and on with clause after clause and phrase after phrase because the writer never stops to breathe or to think about the reader who must follow every single word of it to the end.';
        assert.equal(longSentences('Short one. ' + long).length, 1);
        assert.ok(SK.text.passive('The report was written by the committee.').length === 1);
      },
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
