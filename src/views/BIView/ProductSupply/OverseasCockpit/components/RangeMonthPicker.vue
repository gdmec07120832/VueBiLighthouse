<template>
    <a-range-picker
    class="RangeMonthPicker"
    :value="value"
    :mode="['month', 'month']"
    :open="open"
    @openChange="openChange"
    @panelChange="panelChange"
    format="YYYY-MM"
    :allowClear="false"
    />
</template>

<script>
import moment from 'moment'
export default {
    props: {
        value: {
            type: Array,
            default() {return [moment(), moment()]}
        },
    },
    watch: {
        mode: {
            handler(val, oval){
                if(val && oval && val !== oval){
                    this.open = !this.open
                    if(!this.open) this.mode = null
                }
            },
            deep: true
        },
        open: {
            handler(val, oval){
                if(!val && oval) this.$emit('update:value', this.date)
            }
        }
    },
    data() {
        return {
            mode: null,
            open: false,
            date: []
        }
    },
    methods: {
        openChange(status){
            if(status) this.open = status
        },
        panelChange(value, mode) {
            this.date = value
            this.mode = mode
        },
    }
}
</script>

<style lang="scss" scoped>
.RangeMonthPicker{

}
</style>