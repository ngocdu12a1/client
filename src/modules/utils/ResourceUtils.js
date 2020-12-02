/**
 * Created by Fersher_LOCAL on 7/21/2020.
 */

var ResourceUtils = cc.Class.extend({
    timeToCoin: function(time) {
        return Math.ceil(time / 30);
    },

    resourceToCoin: function(resList) {
        let result = 0;
        for(let resType in resList) {
            if (resList.hasOwnProperty(resType)) {
                if (resType != res.ResourceType.coin)
                    result += Math.ceil(resList[resType] / 1000);
                else
                    result += resList[resType];
            }
        }
        return result;
    }
});

