export const HandleNum = (Type, val) => {
    if (val === null || val === undefined || (!val && val !== 0) || val == 'NaN' || val == '--' || val == 0) return  '--'
    if (Type === 'percent') {
        return (val * 100).toFixed(2) + '%'
    } else if (Type === 'percent1') {
        return (val * 100).toFixed(1) + '%'
    } else if (Type === 'tenThousand') {
        return (val / 10000).toFixed(1).toLocaleString() + '万'
    } else if (Type === 'tenThousand2') {
        return (val / 10000).toFixed(0).toLocaleString() + '万'
    }else if(Type === 'HundredMillion'){
        return (val / 10000 / 10000).toFixed(2).toLocaleString() + '亿'
    }else if (Type === 'round') {
        return ((val * 1).toFixed(0) * 1).toLocaleString()
    }else if(Type === 'Null'){
        return val
    }

}