<template>
    <div class="Radio">
        <span class="label mr10" style="font-size: 12px" v-if="label !== ''">{{label}}</span>
        <a-radio-group class="Radio" :value="value" @change="change" name="radioGroup">
            <template  v-for="(option, index) in options">
                <a-radio v-if="typeof option === 'string'" :value="option" :key="'a' + index">{{option}}</a-radio>
                <a-radio v-else :value="option.value" :key="'b' + index">{{option.label}}</a-radio>
            </template>
        </a-radio-group>
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
    data() {
        return {

        }
    },
    methods: {
        change(e) {
            this.$emit('update:value', e.target.value)
        }
    }
}
</script>

<style lang="scss" scoped>
.Radio{
    display: flex;
    align-items: center;
    .label {
        color: rgba(0,0,0,.65);
        font {
            family: PingFangSC-Regular,PingFang SC;
            size: 12px;
            color: #ccc;
        }
    }
}
</style>