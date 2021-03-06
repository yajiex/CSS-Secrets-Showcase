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
      parent.appendChild(pre);
      const code = document.createElement('code');
      code.classList.add('hljs');
      code.classList.add('css');
      code.setAttribute('contenteditable', 'true');
      code.setAttribute('data-trim', 'true');
      code.setAttribute('data-noescape', 'true');
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
      'Backgrounds & Borders': {
        'Translucent borders': ['translucent-borders.html'],
        'Multiple borders': ['multiple-borders.html'],
        'Flexible background positioning': [
          'extended-bg-position.html',
          'background-origin.html',
          'background-position-calc.html',
        ],
        'Inner rounding': [
          'inner-rounding.html',
        ],
        'Striped backgrounds': [
          'horizontal-stripes.html',
          'vertical-stripes.html',
          'diagonal-stripes.html',
          'diagonal-stripes-60deg.html',
          'subtle-stripes.html',
        ],
        'Complex background patterns': [
          'blueprint.html',
          'polka.html',
          'checkerboard.html',
          'checkerboard-svg.html',
        ],
        '(Pseudo)random backgrounds': [
          'cicada-stripes.html',
        ],
        'Continuous image borders': [
          'continuous-image-borders.html',
          'vintage-envelope.html',
          'marching-ants.html',
          'footnote.html',
        ]
      },
      'Shapes': {
        'Flexible ellipses': [
          'ellipse.html',
          'half-ellipse.html',
          'quarter-ellipse.html',
        ],
        'Parallelograms': [
          'parallelograms.html',
          'parallelograms-pseudo.html',
        ],
        'Diamond images': [
          'diamond-images.html',
          'diamond-clip.html',
        ],
        'Cutout corners': [
          'bevel-corners-gradients.html',
          'scoop-corners.html',
          'bevel-corners.html',
          'bevel-corners-clipped.html',
        ],
        'Trapezoid tabs': [
          'trapezoid-tabs.html',
        ],
        'Simple pie charts': [
          'pie-animated.html',
          'pie-static.html',
          // TODO: JS in templates (not importNode)
          'pie-svg.html',
        ]
      },
      'Visual Effects': {
        'One-sided shadows': [
          'shadow-one-side.html',
          'shadow-2-sides.html',
          'shadow-opposite-sides.html',
        ],
        'Irregular drop shadows': [
          'drop-shadow.html',
        ],
        'Color tinting': [
          'color-tint-filter.html',
          'color-tint.html',
        ],
        'Frosted glass effect': [
          // TODO: <body>
          'frosted-glass.html',
        ],
        'Folded corner effect': [
          'folded-corner.html',
          'folded-corner-realistic.html',

        ]
      },
      'Typography': {
        'Hyphenation': [
          // TODO: Chrome doesn't support hyphens
          'hyphenation.html',
        ],
        'Inserting line breaks': [
          'line-breaks.html',
        ],
        'Zebra-striped text lines': [
          'zebra-lines.html',
        ],
        'Adjusting tab width': [
          'tab-size.html',
        ],
        'Ligatures': [
          'ligatures.html',
        ],
        'Fancy ampersands': [
          // TODO: not work in Chrome
          'ampersands.html',
        ],
        'Custom underlines': [
          'underlines.html',
          'wavy-underlines.html',
        ],
        'Realistic text effects': [
          'letterpress.html',
          'stroked-text.html',
          'glow.html',
          'extruded.html',
        ],
        'Circular text': [
          'circular-text.html',
        ]
      },
      'User Experience': {
        'Picking the right cursor': [
          'disabled.html',
        ],
        'Extending the clickable area': [
          'hit-area-border.html',
          'hit-area.html',
        ],
        'Custom checkboxes': [
          'checkboxes.html',
          'toggle-buttons.html',
        ],
        'De-emphasize by dimming': [
          'dimming-box-shadow.html',
          // TODO: JS in templates (not importNode)
          'native-modal.html',
        ],
        'De-emphasize by blurring': [
          // TODO: JS in templates (not importNode)
          'deemphasizing-blur.html',
        ],
        'Scrolling hints': [
          'scrolling-hints.html',
        ],
        'Interactive image comparison': [
          'image-slider.html',
        ]
      },
      'Structure & Layout': {
        'Intrinsic sizing': [
          'intrinsic-sizing.html',
        ],
        'Taming table column widths': [
          'table-column-widths.html',
        ],
        'Styling by sibling count': [
          // TODO: JS in templates (not importNode)
          'styling-sibling-count.html',
        ],
        'Fluid background, fixed content': [
          'fluid-fixed.html',
        ],
        'Vertical centering': [
          'vertical-centering-abs.html',
          // TODO: related with 50vh viewport
          'vertical-centering-vh.html',
          'vertical-centering.html',
        ],
        'Sticky footers': [
          // TODO: related with 100vh viewport
          'sticky-footer-fixed.html',
          // TODO: related with 100vh viewport
          'sticky-footer.html',
        ]
      },
      'Transitions & Animations': {
        'Elastic transitions': [
          'bounce.html',
          'elastic.html',
        ],
        'Frame-by-frame animations': ['frame-by-frame.html'],
        'Blinking': [
          'blink.html',
        ],
        'Typing animation': [
          'typing.html',
        ],
        'Smooth state animations': [
          'state-animations.html',
        ],
        'Animation along a circular path': [
          'circular-2elements.html',
          'circular.html',
        ]
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
        const chapterVal = partVal[chapterKey];
        chapterVal.forEach((page) => {
          const chapterSection = createSection(partRootSection);
          appendLink(`src/${partKey}/${chapterKey}/${page}`, (templateContent) => {
            injectTemplate(chapterSection, templateContent);
          });
        });
      });
    });
  };

  init();
  initializeReveal();
})();
