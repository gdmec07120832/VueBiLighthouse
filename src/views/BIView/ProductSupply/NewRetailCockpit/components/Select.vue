<template>
    <div class="Select">
        <span class="label">{{label}}</span>
        <a-select :value="value" style="min-width: 80px;max-width: 250px;width: auto" @change="handleChange" dropdownClassName="NewRetailCockpitSelect">
            <a-select-option :value="value1" :key="value1 + '-' + index" v-for="(value1, index) in options" :title="value1">
                {{value1}}
            </a-select-option>
        </a-select>
    </div>
</template>

<script>
export default {
    name: 'Select',
    props: {
        label: {
            type: String
        },
        value: {
            type: [String, Number],
            default: null,
        },
        options: {
            type: Array,
            default() {return []},
        }
    },
    data() {
        return {

        }
    },
    methods: {
        handleChange(val) {
            this.$emit('update:value', val)
        }
    }
}
</script>
<style lang="scss">
.NewRetailCockpitSelect{
    .ant-select-dropdown-menu-item{
        font-size: 12px;
    }
}
</style>
<style lang="scss" scoped>
.Select{
    .label{
        margin-right: 10px;
        height: 22px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 22px;
    }
    /deep/ .ant-select{
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
        color: #000000;
    }
}
</style>