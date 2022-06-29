<template>
    <div class="AnySizeTitle" :style="style">
        {{title}}
    </div>
</template>

<script>
export default {
    props: {
        size: {
            type: String,
            default: 'default',
        },
        title: {
            type: String,
            defaule: '',
        }
    },
    computed: {
        style() {
            let str
            if(this.size === 'default') {
                str = `color: ${this.color};font-size: ${this.fontSize};`
            }
            else if (this.size === 'large') {
                str = `color: ${this.color};font-size: 16px};`
            }
            return str
        }
    },
    data() {
        return {
            // default large
            // size: 'default',
            // title: '趋势',
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: '12px',
        }
    },
}
</script>

<style lang="scss" scoped>
.AnySizeTitle{

}
</style>