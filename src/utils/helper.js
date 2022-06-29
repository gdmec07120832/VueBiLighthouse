import moment from 'moment'
import Vue from 'vue'
import numeral from "numeral";
// import store from '@/store';
import router from '@/routes'
import instance from '@/utils/axios'

export const generatePromise = () => {
  let resolve, reject
  const p = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return [p, resolve, reject]
}

export const flattenTree = (tree = [], childrenKey = 'children') => {
  const recursive = (tree0, acc = []) => {
    for (let item of tree0) {
      acc.push(item)
      if (item[childrenKey] && item[childrenKey].length) {
        recursive(item[childrenKey], acc)
      }
    }
    return acc
  }
  return recursive(tree, [])
}

export const treeMap = (tree, key = 'id', childrenKey = 'children') => {
  const recursive = (tree0, acc = {}) => {
    for (let item of tree0) {
      acc[item[key]] = item
      if (item[childrenKey] && item[childrenKey].length) {
        recursive(item[childrenKey], acc)
      }
    }
    return acc
  }
  return recursive(tree, {})
}

export const createDialog = VueComponentOptions => {
  let instance
  let destroy = () => {
    if (instance) {
      instance.$destroy()
      instance = null
    }
  }
  return {
    create(options = {}, cb = () => {}) {
      if (typeof options === 'function') {
        cb = options
        options = {}
      }
      if (options.destroy) {
        destroy()
      }
      if (!instance) {
        const Ctor = Vue.extend(VueComponentOptions)
        if (options.destroy) {
          const handler = val => {
            if (!val) {
              setTimeout(() => {
                destroy()
              }, 250)
            }
          }
          if (options.watch) {
            options.watch.visible = { handler }
          } else {
            options.watch = { visible: { handler } }
          }
        }
        instance = new Ctor({ ...options, router })
        instance.$mount()
        const owner = this
        if (owner && owner._isVue) {
          let d = owner.$options.beforeDestroy
          owner.$options.beforeDestroy = d ? (Array.isArray(d) ? d.concat(destroy) : [d, destroy]) : [destroy]
        }
        document.body.append(instance.$el)
      }

      Vue.nextTick(() => {
        if (options.propsData) {
          Object.keys(options.propsData).forEach(key => {
            instance.$props[key] = options.propsData[key]
          })
        }
        instance.visible = true
        cb(instance)
      })
    },
    destroy
  }
}

export const downloadBlob = (blob, filename) => {
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(filename))
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(filename))
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}

/**
 * 获取指定区间的日期数组
 * @param a {number}
 * @param b {number}
 * @param format {string}
 */
export const generateDays = (a, b, format = 'MM-DD') => {
  const arr = []
  if (a > b) {
    for (let i = a; i >= b; i--) {
      arr.push(i)
    }
  } else {
    for (let i = a; i <= b; i++) {
      arr.push(i)
    }
  }

  return arr.map(_ => {
    return moment()
      .add(_, 'day')
      .format(format)
  })
}

/**
 * 将数字转为千分位计数法的字符串
 * @param num {number | string | null}
 * @returns {string}
 */
export const numGroupSep = num => {
  if (isNaN(Number(num)) || num === null) {
    return '-'
  }
  return num.toString().replace(/\d+/, n => {
    return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
      return $1 + ','
    })
  })
}

/**
 *
 * @param num {number} 要转换的数字
 * @param unit {number} （1000, 10000 等）
 * @param fractionDigits {number}
 */
export const formatNumber = (num, unit, fractionDigits = 2) => {
  return numGroupSep((num / unit).toFixed(fractionDigits))
}

export const array2HashMapByKey = (arr, key) => {
  const ret = {}
  for (let item of arr) {
    if (ret[item[key]]) {
      ret[item[key]].push(item)
    } else {
      ret[item[key]] = [item]
    }
  }
  return ret
}

export const isUndef = v => {
  return v === undefined || v === null
}

export const fetchSql = (prefix, interfaceName, params) => {
  return instance.post(`/api/admin/data/${prefix}/${interfaceName}/get`, params)
}

export const htmlWrapper = (html, sheetNames = ['sheet']) => {
  const sheets = sheetNames
    .map((name, index) => {
      return `
     <x:ExcelWorksheet>
     <x:Name>${name}</x:Name>
     <x:WorksheetSource HRef="sheet${index}.htm" />
     <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
     </x:ExcelWorksheet>
    `
    })
    .join('')
  // eslint-disable-next-line no-unused-vars
  const baseStyle = `
    <style>
    td {
      line-height: 22px;
    }
    .bg-white {
      background-color: #fff;
    }
    .bg-gary {
      background-color: #f3f5ff;
    }
    .text-red {
      color: red;
    }
    .text-green {
      color: green;
    }
    </style>
  `
  const htmlStart = `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`
  const HTMLWorksheets = html
    .map((content, index) => {
      return `
------=_NextPart_dummy
Content-Location: sheet${index}.htm
Content-Type: text/html; charset=utf-8

${htmlStart}
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link id="Main-File" rel="Main-File" href="../WorkBook.htm">
<link rel="File-List" href="fileList.xml">
</head>
  <body>${baseStyle}${content}</body>
</html>`
    })
    .join('')
  const ListWorksheets = html
    .map((content, index) => {
      return `<o:File HRef="sheet${index}.htm"/>`
    })
    .join('')
  return `MIME-Version: 1.0
X-Document-Type: Workbook
Content-Type: multipart/related; boundary="----=_NextPart_dummy"

------=_NextPart_dummy
Content-Location: WorkBook.htm
Content-Type: text/html; charset=utf-8

${htmlStart}
<head>
<meta name="Excel Workbook Frameset">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="File-List" href="fileList.xml">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>${sheets}</x:ExcelWorksheets><x:ActiveSheet>0</x:ActiveSheet>
</x:ExcelWorkbook>
</xml><![endif]-->
    </head>
<frameset>
  <frame src="sheet0.htm" name="frSheet">
  <noframes><body><p>This page uses frames, but your browser does not support them.</p></body></noframes>
</frameset>
    </html>
${HTMLWorksheets}
Content-Location: fileList.xml
Content-Type: text/xml; charset="utf-8"

<xml xmlns:o="urn:schemas-microsoft-com:office:office">
  <o:MainFile HRef="../WorkBook.htm"/>
  ${ListWorksheets}
  <o:File HRef="fileList.xml"/>
</xml>
------=_NextPart_dummy--
  `
}

export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

export const numFormat =  (value, decimals = 2) => {
  if(isNaN(Number(value))) {
    return ''
  }
  value = Number(value)
  const param = {};
  const k = 10000,
    sizes = ['', '万', '亿', '万亿'];
  let i;
  if(Math.abs(value) < k){
    param.value = numeral(String(value.toFixed(decimals))).format('0,0')
    param.unit=''
  }else{
    i = Math.floor(Math.log(Math.abs(value)) / Math.log(k));

    param.value = ((value / Math.pow(k, i))).toFixed(decimals);
    param.unit = sizes[i];
  }
  return param.value.replace(/(?:\.0*|(\.\d+?)0+)$/, '$1') + param.unit;
}
