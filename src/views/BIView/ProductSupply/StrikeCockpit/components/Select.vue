<template>
    <div class="Select">
        <span v-if="label !== ''" class="label">{{label}}</span>
        <a-select :value="valueToArray" v-bind="config" style="min-width: 80px;max-width: 250px;width: auto" @change="handleChange" dropdownClassName="StrikeCockpitSelect">
            <template v-for="(value1, index) in options">
                <a-select-option v-if="typeof value1 === 'string'" :value="value1" :key="'a' + index" :title="value1">
                    {{value1}}
                </a-select-option>
                <a-select-option v-else :value="value1.value" :key="'b' + index" :title="value1.label">
                    {{value1.label}}
                </a-select-option>
            </template>
        </a-select>
    </div>
</template>

<script>
export default {
    name: 'Select',
    props: {
        label: {
            type: String,
            default: '',
        },
        value: {
            type: [String, Number],
            default: null,
        },
        options: {
            type: Array,
            default() {return []},
        },
        config: {
            type: Object,
            default() {return {}}
        }
    },
    computed: {
        valueToArray() {
            let arr = []
            if(this.value) {
                arr = this.value.split(',')
            }
            return arr
        }
    },
    data() {
        return {

        }
    },
    methods: {
        handleChange(val) {
            this.$emit('update:value', val.toString())
        },

    }
}
</script>
<style lang="scss">
.StrikeCockpitSelect{
    .ant-select-dropdown-menu-item{
        font-size: 12px;
    }
}
</style>
<style lang="scss" scoped>
.Select{
    display: flex;
    align-items: center;
    .label{
        margin-right: 10px;
        height: 22px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
    }
    /deep/ .ant-select{
        flex: 1;
        height: 28px;
        line-height: 28px;
    }
    /deep/ .ant-select-selection--single{
        height: 28px;
        line-height: 28px;
    }
    /deep/ .ant-select-selection__rendered{
        height: 28px;
        line-height: 28px;
    }
    /deep/ .ant-select-selection-selected-value{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
    }
}
</style>