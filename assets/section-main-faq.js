(function() {
  const  coll = document.getElementsByClassName('collapsible')

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener('click', function() {
      this.classList.toggle('collapsible--active')
      const content = this.nextElementSibling
      content.classList.toggle('content--visible')
    })
  }
})()
