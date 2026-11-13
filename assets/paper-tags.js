(() => {
  const papers = [...document.querySelectorAll('#research-papers .paper')];
  const tags = [...document.querySelectorAll('.paper-tag')];
  const filter = document.getElementById('research-filter');
  const label = document.getElementById('research-filter-label');
  const showAll = document.getElementById('research-show-all');
  if (!papers.length || !filter || !label || !showAll) return;

  const topics = new Map(tags.map(tag => [tag.dataset.topic, tag.textContent.trim()]));
  let selected = '';

  function apply(topic) {
    selected = topics.has(topic) ? topic : '';
    papers.forEach(paper => {
      paper.hidden = Boolean(selected) && !paper.dataset.topics.split(' ').includes(selected);
    });
    tags.forEach(tag => tag.setAttribute('aria-pressed', String(tag.dataset.topic === selected)));
    filter.hidden = !selected;
    label.textContent = selected ? `Topic: ${topics.get(selected)}` : '';
  }

  function select(topic) {
    apply(topic);
    const url = new URL(location.href);
    if (selected) url.searchParams.set('topic', selected);
    else url.searchParams.delete('topic');
    history.replaceState(null, '', url);
  }

  tags.forEach(tag => {
    tag.addEventListener('click', () => select(selected === tag.dataset.topic ? '' : tag.dataset.topic));
  });
  showAll.addEventListener('click', () => {
    const active = tags.find(tag => tag.dataset.topic === selected);
    select('');
    if (active) active.focus();
  });
  window.addEventListener('popstate', () => apply(new URLSearchParams(location.search).get('topic')));
  apply(new URLSearchParams(location.search).get('topic'));
})();
