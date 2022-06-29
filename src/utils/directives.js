import  throttle from 'lodash/throttle'

const cellTooltipDom = document.createElement('div')

cellTooltipDom.style.height = '22px'
cellTooltipDom.style.background = '#fff';
cellTooltipDom.style.display = 'none'
cellTooltipDom.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)'
cellTooltipDom.style.padding = '0 6px'
cellTooltipDom.style.position = 'fixed'
cellTooltipDom.style.zIndex = '999'
cellTooltipDom.style.fontSize = '12px'
cellTooltipDom.style.lineHeight = '22px'


export const tableCellTooltip = function (el, binding) {
  const pad = binding.value?.pad || 0
  setTimeout(() => {
    const cells = el.querySelectorAll('td')
    Array.from(cells).forEach(td => {
      if(!td.resolve) {
        td.addEventListener('mousemove', throttle((e) => {
          console.log(td.clientWidth, td.scrollWidth)
          if(td.clientWidth < td.scrollWidth - pad) {
            cellTooltipDom.innerText = td.innerText
            cellTooltipDom.style.display = 'inline-block'
            cellTooltipDom.style.left = e?.pageX + 10 + 'px'
            cellTooltipDom.style.top = e?.pageY - 30 + 'px'
            if(!cellTooltipDom.inserted) {
              document.body.appendChild(cellTooltipDom)
            }
          }
        }))
        td.addEventListener('mouseout', () => {
          cellTooltipDom.style.display = 'none'
        })
        td.resolve = true
      }
    })
  }, 50)

}
