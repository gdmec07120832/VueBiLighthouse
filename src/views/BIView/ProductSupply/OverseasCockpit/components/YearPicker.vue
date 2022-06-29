<template>
    <a-date-picker class="YearPicker"
    :allowClear="false"
    style="width: 150px"
    format="年(YYYY)"
    valueFormat="YYYY"
    suffixIcon=" "
    mode="year"
    :open="open"
    :value="year"
    @openChange="openChange"
    @panelChange="panelChange"
    />
</template>

<script>
import moment from 'moment'
export default {
    props: {
        year: {
            type: String,
            default: moment().format('YYYY')
        }
    },
    data() {
        return {
            open: false,
        }
    },
    methods: {
        openChange(status) {
            if (status) {
                this.open = true;
            } else {
                this.open = false;
            }
        },
        panelChange(value){
            this.$emit('update:year', value.format('YYYY'))
            this.open = false;
        },
    }
}
</script>

<style lang="scss" scoped>
/deep/ .ant-input{
    font-size: 12px;
}
</style>