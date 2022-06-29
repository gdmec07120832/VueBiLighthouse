<template>
  <div>
    <div class="flex flex-between mb10">
      <div>
        <span class="sub-title2">{{title}}</span>
      </div>
      <div class="text-xs-radio" style="text-align: right">
      <a-radio-group v-model="query.option" size="small" button-style="solid">
        <a-radio-button value="1">数量</a-radio-button>
        <a-radio-button value="2">占比</a-radio-button>
      </a-radio-group>
    </div>
    </div>
    <div>
      <table v-if="query.option === '1'" class="table text-xs" style="border-collapse: collapse;width: 100%">
        <thead>
        <tr>
          <td>分类</td>
          <td>数量</td>
          <td>同比</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>好评</td>
          <td>{{ counts['本月好评数'] }}</td>
          <td :class="[counts['本月好评数'] > counts['同期好评数'] ? 'text-red' : 'text-green']">
            {{ computeYoY(counts['同期好评数'], counts['本月好评数']) }}
          </td>
        </tr>
        <tr>
          <td>中评</td>
          <td>{{ counts['本月中评数'] }}</td>
          <td :class="[counts['本月中评数'] < counts['同期中评数'] ? 'text-red' : 'text-green']">
            {{ computeYoY(counts['同期中评数'], counts['本月中评数']) }}
          </td>
        </tr>
        <tr>
          <td>差评</td>
          <td>{{ counts['本月差评数'] }}</td>
          <td :class="[counts['本月差评数'] < counts['同期差评数'] ? 'text-red' : 'text-green']">
            {{ computeYoY(counts['同期差评数'], counts['本月差评数']) }}
          </td>
        </tr>
        <tr>
          <td>个人差评</td>
          <td>{{ counts['本月个人差评数'] }}</td>
          <td :class="[counts['本月个人差评数'] < counts['同期个人差评数'] ? 'text-red' : 'text-green']">
            {{ computeYoY(counts['同期个人差评数'], counts['本月个人差评数']) }}
          </td>
        </tr>
        <tr>
          <td>总评价</td>
          <td>{{ counts['本月总评价数'] }}</td>
          <td :class="[counts['本月总评价数'] > counts['同期总评价数'] ? 'text-red' : 'text-green']">
            {{ computeYoY(counts['同期总评价数'], counts['本月总评价数']) }}
          </td>
        </tr>
        <tr>
          <td>成交商品</td>
          <td>{{ counts['本月成交数'] }}</td>
          <td :class="[counts['本月总评价数']] > counts['同期总评价数'] ? 'text-red' : 'text-green'">
            {{ computeYoY(counts['同期成交数'], counts['本月成交数']) }}
          </td>
        </tr>
        </tbody>
      </table>
      <table v-if="query.option === '2'" class="table text-xs"
             style="line-height: 2.5;border-collapse: collapse; width: 100%">
        <thead>
        <tr>
          <td>分类</td>
          <td>占比</td>
          <td>同比</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>好评</td>
          <td>{{ computeRate(counts['本月好评数'], counts['本月总评价数']) }}</td>
          <td :class="[
                       computeYoYRate([counts['同期好评数'], counts['同期总评价数']],
                          [counts['本月好评数'], counts['本月总评价数']]
                      ).startsWith('-') ? 'text-green' : 'text-red'
                  ]">{{
              computeYoYRate([counts['同期好评数'], counts['同期总评价数']],
                  [counts['本月好评数'], counts['本月总评价数']]
              )
            }}
          </td>
        </tr>
        <tr>
          <td>中评</td>
          <td>{{ computeRate(counts['本月中评数'], counts['本月总评价数']) }}</td>
          <td :class="[
                     computeYoYRate([counts['同期中评数'], counts['同期总评价数']],
                          [counts['本月中评数'], counts['本月总评价数']]
                      ).startsWith('-') ? 'text-red' : 'text-green'
                  ]">
            {{
              computeYoYRate([counts['同期中评数'], counts['同期总评价数']],
                  [counts['本月中评数'], counts['本月总评价数']]
              )
            }}
          </td>
        </tr>
        <tr>
          <td>差评</td>
          <td>{{ computeRate(counts['本月差评数'], counts['本月总评价数']) }}</td>
          <td :class="[
                       computeYoYRate([counts['同期差评数'], counts['同期总评价数']],
                          [counts['本月差评数'], counts['本月总评价数']]
                      ).startsWith('-') ? 'text-red' : 'text-green'
                  ]">
            {{
              computeYoYRate([counts['同期差评数'], counts['同期总评价数']],
                  [counts['本月差评数'], counts['本月总评价数']]
              )
            }}
          </td>
        </tr>
        <tr>
          <td>评价率</td>
          <td>{{ computeRate(counts['本月总评价数'], counts['本月成交数']) }}</td>
          <td :class="[
                       computeYoYRate([counts['同期总评价数'], counts['同期成交数']],
                          [counts['本月总评价数'], counts['本月成交数']]
                      ).startsWith('-') ? 'text-green' : 'text-red'
                  ]">
            {{
              computeYoYRate([counts['同期总评价数'], counts['同期成交数']],
                  [counts['本月总评价数'], counts['本月成交数']]
              )
            }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
name: "statTableData",
  props: {
    title: String,
    counts: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      query: {
        option: '1'
      }
    }
  },
  methods: {
    computeYoY (last, now) {
      if (!now || !last) {
        return '--'
      } else {
        return (((now - last) / last) * 100).toFixed(2) + '%'
      }
    },
    computeYoYRate ([a1, a2], [b1, b2]) {
      if (!a1 || !a2 || !b1 || !b2) {
        return '--'
      } else {
        return ((((b1 / b2) - (a1 / a2)) / (a1 / a2)) * 100).toFixed(2) + '%'
      }
    },
    computeRate (a, b) {
      if (!a || !b) {
        return '--'
      } else {
        return ((a / b) * 100).toFixed(2) + '%'
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.text-xs-radio {
  /deep/ .ant-radio-wrapper {
    font-size: 12px;
  }
}

.table {
  line-height: calc(0.0476px * var(--height));
  thead td{
      background: #f5f7ff;
  }
  td {
    white-space: nowrap;
    overflow: hidden;
    border: 1px solid #e7e9f0;
    text-align: center;
    padding: 0 10px
  }
  tr{
      td:nth-child(1){
          text-align: left;
      }
      td:nth-child(2), td:nth-child(3){
          text-align: right;
      }
  }

  tbody tr:nth-child(2n+1) {
    //background: #f1f9fd;
  }
}


.sub-title2 {
  position: relative;
  font-size: 16px;
}
</style>
