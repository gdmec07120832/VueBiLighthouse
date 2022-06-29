import numeral from 'numeral'

export default {
  data () {
    const months = Array(12).fill(null).map((_, i) => i + 1)
    return {
      months
    }
  },
  computed: {
    year () {
      return (this.query.yearMonth).getFullYear()
    },
    month () {
      return (this.query.yearMonth).getMonth()
    }
  },
  methods: {
    formatW (v) {
      return v ? numeral(v / 10000).format('0,0') + '万' : '--'
    },
    formatW1 (v) {
      return v ? numeral(v / 10000).format('0,0.0') + '万' : '--'
    },
    formatZ (v) {
      return v ? numeral(v).format('0,0') : '--'
    },
    formatZ2 (v) {
      return v ? numeral(v).format('0,0.00') : '--'
    },
    formatRto (v) {
      return v ? numeral(v).format('0.00%') : '--'
    }
  }
}
