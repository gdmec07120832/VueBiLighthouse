<template>
    <div class="CheckBox">
        <span v-if="label" class="mr10" style="color: rgba(0, 0, 0, 0.65)">{{label}}</span>
        <a-checkbox-group :value="valueToArray" @change="change">
            <a-checkbox :value="option" v-for="(option, index) in options" :key="index">
                {{option}}
            </a-checkbox>
        </a-checkbox-group>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: '',
        },
        value: {
            type: String,
            default: '',
        },
        options: {
            type: Array,
            default() {return []}
        }
    },
    computed: {
        valueToArray() {
            let arr = []
            if(this.value !== '') {
                arr = this.value.split(',')
            }
            return arr
        }
    },
    methods: {
        change(a){
            this.$emit('update:value', a.toString())
        }
    }
}
</script>

<style lang="scss" scoped>
.CheckBox{

}
</style>