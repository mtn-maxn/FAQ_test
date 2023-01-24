(function () {
  const blockId = document.currentScript.getAttribute('data-block-id')
  const eventName = document.currentScript.getAttribute('data-event-name') || 'faqSearch'

  window.addEventListener('DOMContentLoaded', () => {
    const currentBlock = document.querySelector(`[id="block-${ blockId }"]`)
    const accordions = currentBlock.querySelectorAll('[data-id="component-accordion-faq"]')

    accordions.forEach(initAccordion)

    function initAccordion (accordion) {
      const stub = accordion.querySelector('[data-id="component-accordion-faq__stub"]')
      const faqs = accordion.querySelectorAll('[data-id="component-accordion-faq__item"]')

      for (let i = 0; i < faqs.length; i++) {
        faqs[i].addEventListener('click', function () {
          this.classList.toggle('is-active');
          this.nextElementSibling.classList.toggle(
            'is-visible'
          );

//          this.nextElementSibling.style.maxHeight = this.nextElementSibling.scrollHeight + 'px'
        });
      }
      const handleSearch = debounce((searchStr = '') => {
        const stubVisibleClass = 'is-visible'
        stub.classList.remove(stubVisibleClass)

        searchStr = searchStr.trim().toLowerCase();

        let matches = 0
        for (let i = 0; i < faqs.length; i++) {
          const faq = faqs[i]

          if (searchStr && faq.nextElementSibling.innerText
            .toLocaleLowerCase()
            .includes(searchStr)
          ) {
            matches++
            removeAllHighlights(faq.nextElementSibling)
            addHighlights(faq.nextElementSibling, searchStr)
            openFAQ(faq)
          } else {
            closeFAQ(faq)
            removeAllHighlights(faq.nextElementSibling)
          }
        }

        if(!matches && searchStr) stub.classList.add(stubVisibleClass)
      }, 300);

      if (!eventBus) {
        console.warn('Instance of EventBus not found. Search will not work')
        return;
      }

      eventBus?.on(eventName, handleSearch);
    }

    function openFAQ(faq) {
      faq.classList.add('is-active')
      faq.nextElementSibling.classList.add(
        'is-visible'
      )
    }

    function closeFAQ(faq) {
      faq.classList.remove('is-active')
      faq.nextElementSibling.classList.remove(
        'is-visible'
      )
    }

    function addHighlights(htmlElement, query) {
      query = escapeRegExp(query)
      const re = new RegExp(`(${query})`, 'gmi')
      htmlElement.innerHTML = htmlElement.innerText.replaceAll(re, '<mark>$1</mark>')
    }

    function removeAllHighlights(htmlElement) {
      let innerHtml = htmlElement.innerHTML
      innerHtml = innerHtml.replaceAll('<mark>', '')
      innerHtml = innerHtml.replaceAll('</mark>', '')
      htmlElement.innerHTML = innerHtml
    }

    /* https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex */
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
  })
})()
