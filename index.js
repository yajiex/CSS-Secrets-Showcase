(function () {
  const slides = document.querySelector('.reveal > .slides');

  const appendLink = (name) => {
    const updateShadow = (shadow, style, element) => {
      shadow.innerHTML = style + element;
    };

    const createCode = (parent, codeText) => {
      const pre = document.createElement('pre');
      pre.className += ' stretch';
      parent.appendChild(pre);
      const code = document.createElement('code');
      code.className += ' hljs';
      code.setAttribute('contenteditable', 'true');
      code.setAttribute('data-trim', 'true');
      code.innerText = codeText;
      pre.appendChild(code);
      return code;
    };

    const link = document.createElement('link');
    link.rel = 'import';
    link.href = 'src/' + name + '.html';
    link.onload = () => {
      const section = document.createElement('section');
      section.className += ' showcase future';
      const template = link.import.querySelector('template').content;
      const result = document.createElement('div');
      const shadow = result.createShadowRoot();
      const div = document.createElement('div');

      const p = document.createElement('p');
      p.innerText = template.querySelector('x-notes').innerText.trim();
      div.appendChild(p);
      const code = createCode(div, template.querySelector('style').innerHTML.trim());
      code.addEventListener('input', () => {
        updateShadow(shadow, '<style>' + code.innerText + '</style>', template.querySelector('x-element').innerHTML);
      });

      section.appendChild(div);
      section.appendChild(result);

      updateShadow(shadow, template.querySelector('style').outerHTML, template.querySelector('x-element').innerHTML);
      slides.appendChild(section);
    };
    document.head.appendChild(link);
  };

  Reveal.addEventListener('ready', () => {
    appendLink('bounce');
  });
})();
