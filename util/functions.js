exports.orderByDate = function(arr){
    arr.sort((a, b) => {
        if(a.date.split('/')[2]+a.date.split('/')[1]+a.date.split('/')[0] > b.date.split('/')[2]+b.date.split('/')[1]+b.date.split('/')[0]){
          return 1;
        }else{
          return -1;
        }
    });
    return arr;
};