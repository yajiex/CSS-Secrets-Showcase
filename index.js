(function () {
  const slides = document.querySelector('.reveal > .slides');

  const initializeReveal = () => {
    // More info https://github.com/hakimel/reveal.js#configuration
    Reveal.initialize({
      history: true,

      // More info https://github.com/hakimel/reveal.js#dependencies
      dependencies: [
        { src: 'vendors/reveal.js-3.3.0/plugin/markdown/marked.js' },
        { src: 'vendors/reveal.js-3.3.0/plugin/markdown/markdown.js' },
        { src: 'vendors/reveal.js-3.3.0/plugin/notes/notes.js', async: true },
        {
          src: 'vendors/reveal.js-3.3.0/plugin/highlight/highlight.js', async: true, callback: function () {
          hljs.initHighlightingOnLoad();
        }
        }
      ]
    });
  };

  const injectTemplate = (section, templateContent) => {
    const updateShadow = (shadow, style, element) => {
      shadow.innerHTML = style + element;
    };

    const createCode = (parent, codeText) => {
      const pre = document.createElement('pre');
      pre.classList.add('stretch');
      parent.appendChild(pre);
      const code = document.createElement('code');
      code.classList.add('hljs');
      code.setAttribute('contenteditable', 'true');
      code.setAttribute('data-trim', 'true');
      code.innerText = codeText;
      pre.appendChild(code);
      return code;
    };

    const createNote = (parent, noteText) => {
      const p = document.createElement('p');
      p.innerText = noteText;
      parent.appendChild(p);
      return p;
    };

    const createLeftPart = (parent) => {
      const div = document.createElement('div');
      div.classList.add('left');
      parent.appendChild(div);
      return div;
    };

    const createRightPart = (parent) => {
      const div = document.createElement('div');
      div.classList.add('right');
      parent.appendChild(div);
      return div;
    };

    const left = createLeftPart(section);
    const right = createRightPart(section);
    const shadow = right.createShadowRoot();

    createNote(left, templateContent.querySelector('x-notes').innerText.trim());
    const code = createCode(left, templateContent.querySelector('style').innerHTML.trim());
    code.addEventListener('input', () => {
      updateShadow(shadow, '<style>' + code.innerText + '</style>', templateContent.querySelector('x-element').innerHTML);
    });

    updateShadow(shadow, templateContent.querySelector('style').outerHTML, templateContent.querySelector('x-element').innerHTML);
  };

  const appendLink = (templatePath, callback) => {
    const link = document.createElement('link');
    link.rel = 'import';
    link.href = templatePath;
    link.onload = () => {
      callback(link.import.querySelector('template').content);
    };
    document.head.appendChild(link);
  };

  const init = () => {
    const templatesSrc = {
      'Transitions & Animations': {
        'Elastic transitions': 'bounce.html',
        'Frame-by-frame animations': 'frame-by-frame.html',
      },
    };

    const createSection = (parent) => {
      const section = document.createElement('section');
      parent.appendChild(section);
      return section;
    };

    Object.keys(templatesSrc).forEach((partKey) => {
      // Transitions & Animations
      const partRootSection = createSection(slides);
      const partSection = createSection(partRootSection);
      partSection.innerText = partKey;
      const partVal = templatesSrc[partKey];
      Object.keys(partVal).forEach((chapterKey) => {
        // Elastic transitions - bounce.html
        const chapterSection = createSection(partRootSection);
        const chapterVal = partVal[chapterKey];
        appendLink(`src/${partKey}/${chapterKey}/${chapterVal}`, (templateContent) => {
          injectTemplate(chapterSection, templateContent);
        });
      });
    });
  };

  init();
  initializeReveal();
})();
