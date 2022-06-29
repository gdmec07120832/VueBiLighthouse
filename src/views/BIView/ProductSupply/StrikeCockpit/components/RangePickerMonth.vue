<template>
    <a-range-picker
        :value="date"
        :allowClear="false"
        :mode="['month', 'month']"
        :open="open"
        format="YYYY-MM"
        @panelChange="panelChange"
        @openChange="openChange"
        style="width: 250px"
    />
</template>

<script>
import moment from "moment";
export default {
    props: {
        date: {
            type: Array,
            default() {return [moment(), moment()]},
        }
    },
    watch: {
        mode: {
            handler(val, oval) {
                if(val !== null && oval !== null) {
                    this.$emit('update:date', this.storeDate)
                    // this.date = this.storeDate
                    this.open = false
                }
            },
        },
        open: {
            handler(val) {
                if(!val) this.mode = null
            }
        }
    },
    data() {
        return {
            hoverDate: null,
            mode: null,
            open: false,
            storeDate: null,
        }
    },
    methods: {
        panelChange(val, mode){
            this.storeDate = val
            this.mode = mode
        },
        openChange(state) {
            this.open = state
        },
    }
}
</script>

<style lang="scss" scoped>

</style>