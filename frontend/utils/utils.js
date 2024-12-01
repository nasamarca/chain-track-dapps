// export const getCurrentEpoch = () => {
//     const secondsSinceEpoch = Math.round(Date.now() / 1000);
//     return secondsSinceEpoch;
// };


// export const getCustomDateEpoch = (date) => {
//     var someDate = new Date(date);

//     return someDate.getTime();
// };

export const getCurrentEpoch = () => {
    return Math.floor(Date.now() / 1000); // Return dalam detik
};

export const getCustomDateEpoch = (date) => {
    try {
        if (!date) return 0;
        return Math.floor(new Date(date).getTime() / 1000);
    } catch (error) {
        console.error("Error converting date:", error);
        return 0;
    }
};

export const formatDate = (epochTimestamp) => {
    try {
        if (!epochTimestamp) return '';
        return new Date(epochTimestamp * 1000).toLocaleDateString();
    } catch (error) {
        console.error("Error formatting date:", error);
        return '';
    }
};

export const epochToHumanReadable = (epochTimestamp) => {
    try {
        if (!epochTimestamp) return '';
        const date = new Date(Number(epochTimestamp) * 1000);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        console.error("Error converting epoch to date:", error);
        return '';
    }
};

export const increaseGasLimit = (estimatedGasLimit) => {
    return estimatedGasLimit.mul(130).div(100) // increase by 30%
}

// export function epochToHumanReadable(epoch) {
//     let x = Number(epoch)
//     const date = new Date(x);
//     return date.toDateString();
// }

export  function firstAndLastFour(string) {
    return string.slice(0, 4) + '......' + string.slice(-4);
}


// =============================================

export const formatItem = (item) => {
    return {
        name: item.name,
        manufacturerName: item.manufacturerName,
        manufacturer: item.manufacturer,
        manufacturedDate: epochToHumanReadable(item.manufacturedDate?.toString()),
        expiringDate: epochToHumanReadable(item.expiringDate?.toString()),
        isInBatch: item.isInBatch,
        batchCount: item.batchCount?.toString(),
        barcodeId: item.barcodeId,
        itemImage: item.itemImage,
        itemType: item.itemType,
        usage: item.usage,
    }
}
