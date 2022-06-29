<template>
    <div class="Sort">
        <a-icon type="caret-up" class="icon" :class="{active: currentValue === 'up' ? true : false}" style="transform: translateY(2px)"/>
        <a-icon type="caret-down" class="icon" :class="{active: currentValue === 'down' ? true : false}" style="transform: translateY(-2px)"/>
    </div>
</template>

<script>
export default {
    props: {
        current: {
            type: [String, Boolean],
            default: null
        }
    },
    watch: {
        current(val) {
            this.currentValue = val
        }
    },
    created() {
        this.currentValue = this.current
    },
    data() {
        return {
            active: '#46bca0',
            currentValue: null,
        }
    },
    methods: {
        click() {
            switch (this.currentValue) {
                case null:
                    this.currentValue = 'up'
                    break;
                case 'up':
                    this.currentValue = 'down'
                    break;
                case 'down':
                    this.currentValue = null
                    break;
            }
        },
        reset() {
            this.currentValue = null
        }
    }
}
</script>

<style lang="scss" scoped>
.Sort{
    width: 12px;
    height: 24px;
    display: inline-block;
    .icon{
        display: block;
        color: #bfbfbf;
        //height: 10px;
        //width: 10px;
        font-size: 12px;
    }
    .active {
        color: #46bca0;
    }
}
</style>