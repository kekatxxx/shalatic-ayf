exports.orderByDate = function(arr, includePast){
    let array = arr.slice();
    array.sort((a, b) => {
        if(a.date > b.date){
          return 1;
        }else{
          return -1;
        }
    });
    if(includePast !== true){
      array = array.filter(elem => {
        return new Date(elem.date).getTime() > Date.now();
      });
    }
    return array;
};

exports.getLessonsInNextDays = function(arr, days_start, days_end){
  const startDate = new Date(Date.now() + days_start*24*60*60*1000);
  console.log('sta', startDate);
  let endDate = null;
  if(days_end){
    endDate = new Date(Date.now() + days_end*24*60*60*1000);
    console.log('end', endDate);
  }
  const array = arr.filter(elem => {
    const lessonDate = new Date(elem.date);
    if (endDate !== null){
      return lessonDate > startDate && lessonDate < endDate;
    }
    return lessonDate > startDate;
  });
  return array;
}

exports.formatDate = function(arr){
  arr.map((elem) => {
    const nomeGiorno = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    const nomeMese = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    let date = elem.date.split(",")[0];
    date = new Date(date);
    let ora = elem.date.split(",")[1].trim();
    ora = ora.split(":")[0]+":"+ora.split(":")[1];
    elem.date = nomeGiorno[date.getDay()]+" "+date.getDate()+" "+nomeMese[date.getMonth()]+" " + ora;
  });
  return arr;
}
