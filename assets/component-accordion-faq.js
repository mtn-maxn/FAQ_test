window.addEventListener("DOMContentLoaded", () => {
  const accordions = document.body.querySelectorAll('[data-id="component-accordion-faq"]')

  accordions.forEach(initAccordion)

  function initAccordion (accordion) {
    const stub = accordion.querySelector('[data-id="component-accordion-faq__stub"]')
    const faqs = accordion.querySelectorAll('[data-id=component-accordion-faq__item]')

    for (let i = 0; i < faqs.length; i++) {
      faqs[i].addEventListener("click", function () {
        this.classList.toggle("component-accordion-faq__item--active");
        this.nextElementSibling.classList.toggle(
          "component-accordion-faq__content--visible"
        );
      });
    }
    const handleSearch = debounce((searchStr = "") => {
      const stubVisibleClass = 'component-accordion-faq__stub--visible'
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
      console.warn("Instance of EventBus not found. Search will not work")
      return;
    }

    eventBus?.on("faqSearch", handleSearch);
  }

  function openFAQ(faq) {
    faq.classList.add("component-accordion-faq__item--active")
    faq.nextElementSibling.classList.add(
      "component-accordion-faq__content--visible"
    )
  }

  function closeFAQ(faq) {
    faq.classList.remove("component-accordion-faq__item--active")
    faq.nextElementSibling.classList.remove(
      "component-accordion-faq__content--visible"
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
