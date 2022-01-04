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
